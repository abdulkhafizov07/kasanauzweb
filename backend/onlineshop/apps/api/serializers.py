from rest_framework import serializers

from apps.onlineshop_main.models import Category, Product, ProductComment, ProductImage
from apps.users.user_model import UserModel


class ProductUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ["guid", "pfp", "first_name", "last_name"]


class ProductUserPurposesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ["guid", "pfp", "first_name", "last_name", "purposes"]


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["guid", "title", "meta"]


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["guid", "image"]


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    image = serializers.SerializerMethodField()
    user = ProductUserSerializer()

    def get_image(self, obj):
        try:
            return obj.onlineshop_app_product_images.first().image.url
        except Exception as err:
            return f"Error: {err}"

    class Meta:
        model = Product
        fields = ["guid", "user", "category", "title", "meta", "short_description", "price", "price_discount", "image"]


class CategoryListProductSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    user = ProductUserSerializer()

    def get_image(self, obj):
        try:
            return obj.onlineshop_app_product_images.first().image.url
        except:
            return ""

    class Meta:
        model = Product
        fields = ["guid", "user", "title", "meta", "short_description", "price", "price_discount", "image"]


class UserProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    image = serializers.SerializerMethodField()

    def get_image(self, obj):
        try:
            return obj.onlineshop_app_product_images.first().image.url
        except:
            return "/assets/images/404.png"

    class Meta:
        model = Product
        fields = ["guid", "category", "title", "meta", "short_description", "price", "price_discount", "image"]


class CreateProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["user", "category", "title", "meta", "short_description", "description", "price", "price_discount"]


class FullLoadContentSerializer(serializers.Serializer):
    categories = CategorySerializer(many=True)
    fast_selling_products = ProductSerializer(many=True)
    new_products = ProductSerializer(many=True)
    recommended_products = ProductSerializer(many=True)


class CategoryProductSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    user = ProductUserSerializer()

    def get_image(self, obj):
        return obj.onlineshop_app_product_images.first().image.url

    class Meta:
        model = Product
        fields = ["guid", "user", "title", "meta", "short_description", "price", "price_discount", "image"]


class ProductFullSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    user = ProductUserPurposesSerializer()
    onlineshop_app_product_images = ProductImageSerializer(many=True)

    class Meta:
        model = Product
        fields = [
            "guid",
            "user",
            "category",
            "title",
            "meta",
            "short_description",
            "description",
            "price",
            "price_discount",
            "is_verified",
            "onlineshop_app_product_images",
        ]


class FullProductSerializer(serializers.Serializer):
    product = ProductFullSerializer()
    related = ProductSerializer(many=True)


class LeastProductSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    def get_image(self, obj):
        return obj.onlineshop_app_product_images.first().image.url

    class Meta:
        model = Product
        fields = ["title", "short_description", "price_discount", "image"]


class ReplyCommentSerializer(serializers.ModelSerializer):
    user = ProductUserSerializer()

    class Meta:
        model = ProductComment
        fields = ["guid", "user", "comment", "created_at"]


class FlatReplySerializer(serializers.ModelSerializer):
    user = ProductUserSerializer()

    class Meta:
        model = ProductComment
        fields = ["guid", "user", "comment", "created_at"]


class RootCommentSerializer(serializers.ModelSerializer):
    user = ProductUserSerializer()
    replies = serializers.SerializerMethodField()

    class Meta:
        model = ProductComment
        fields = ["guid", "user", "comment", "created_at", "replies"]

    def get_replies(self, obj):
        def collect_all_replies(comment):
            all_replies = []
            for reply in comment.onlineshop_app_comment_replies.all():
                all_replies.append(reply)
                all_replies += collect_all_replies(reply)
            return all_replies

        all_flat_replies = collect_all_replies(obj)
        return FlatReplySerializer(all_flat_replies, many=True, context=self.context).data


class SearchResultSerializer(serializers.Serializer):
    meta = serializers.CharField()
    title = serializers.CharField()


class ProductDataSerializer(serializers.ModelSerializer):
    user = serializers.UUIDField(source="user.guid", read_only=True)

    class Meta:
        model = Product
        fields = ["guid", "title", "user", "category", "short_description", "price", "price_discount"]
