from rest_framework.serializers import ModelSerializer, SerializerMethodField, CharField, UUIDField, ListField, ImageField, ValidationError

from apps.onlineshop_main.models import Category, Product, ProductImage
from apps.users.models import UserModel
from .mixins import SlugMetaValidationMixin


class AdminManageCategoriesModelSerializer(SlugMetaValidationMixin, ModelSerializer):
    class Meta:
        model = Category
        fields = ["guid", "title", "meta", "state", "created_at"]
        read_only_fields = ["guid", "created_at"]


class _AdminManageProductsUserModelSerializer(ModelSerializer):
    class Meta:
        model = UserModel
        fields = ["guid", "first_name", "last_name"]
        read_only_fields = fields


class _AdminManageProductsCategoryModelSerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = ["guid", "title", "meta"]
        read_only_fields = fields


class _AdminManageProductImagesModelSerializer(ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["image"]
        read_only_fields = fields


class AdminManageProductsModelSerializer(SlugMetaValidationMixin, ModelSerializer):
    # Write-only helper fields
    user_phone = CharField(write_only=True, required=False)
    category_uuid = UUIDField(write_only=True, required=False)
    images_upload = ListField(
        child=ImageField(), write_only=True, required=False
    )

    # Read-only nested fields
    user = _AdminManageProductsUserModelSerializer(read_only=True)
    category = _AdminManageProductsCategoryModelSerializer(read_only=True)
    images = SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "guid",
            "user",
            "category",
            "images",          # read-only for GET
            "title",
            "meta",
            "short_description",
            "price",
            "price_discount",
            "state",
            "created_at",
            "user_phone",      # write-only
            "category_uuid",   # write-only
            "images_upload",   # write-only
        ]
        read_only_fields = ["guid", "user", "category", "images", "created_at"]

    def get_images(self, obj):
        return _AdminManageProductImagesModelSerializer(
            obj.onlineshop_app_product_images.all(), many=True
        ).data
    
    def create(self, validated_data):
        user_phone = validated_data.pop("user_phone", None)
        category_uuid = validated_data.pop("category_uuid", None)
        images_upload = validated_data.pop("images_upload", [])

        if user_phone:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            validated_data["user"] = User.objects.get(phone=user_phone)

        if category_uuid:
            validated_data["category"] = Category.objects.get(guid=category_uuid)
        else:
            raise ValidationError({"category_uuid": "This field is required."})

        product = Product.objects.create(**validated_data)

        for img in images_upload:
            ProductImage.objects.create(product=product, image=img)

        return product

