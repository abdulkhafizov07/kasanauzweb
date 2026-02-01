from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from .base_model import BaseModel
from .managers import ModelManager
from .mixins import AutoSlugMixin


class Category(AutoSlugMixin, BaseModel):
    title = models.CharField(max_length=256)
    meta = models.SlugField(max_length=256, unique=True)

    objects = ModelManager()
    admin_objects = models.Manager()

    def __str__(self):
        return f"{self.title} {'✅' if self.is_active else '❌'}"

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"
        db_table = "onlineshop_app__categories"
        ordering = ("-created_at",)


class Product(AutoSlugMixin, BaseModel):
    user = models.ForeignKey("users.UserModel", on_delete=models.CASCADE, related_name="onlineshop_app_user_products")
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="onlineshop_app_category_products")
    title = models.CharField(max_length=256)
    meta = models.SlugField(max_length=256, unique=True)
    short_description = models.TextField(max_length=250)
    description = models.TextField(null=True, blank=True)
    price = models.DecimalField(max_digits=26, decimal_places=2)
    price_discount = models.DecimalField(max_digits=26, decimal_places=2, null=True, blank=True)

    objects = ModelManager()
    admin_objects = models.Manager()

    def __str__(self):
        return f"{self.title} - {self.user} {'✅' if self.is_active else '❌'}"

    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "Products"
        db_table = "onlineshop_app__products"
        ordering = ("-created_at",)


class ProductImage(BaseModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="onlineshop_app_product_images")
    image = models.ImageField(upload_to="products/")

    def __str__(self):
        return f"{self.product.title} Image {'✅' if self.is_active else '❌'}"

    class Meta:
        verbose_name = "Product Image"
        verbose_name_plural = "Product Images"
        db_table = "onlineshop_app__product_images"
        ordering = ("-created_at",)


class ProductRating(BaseModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="onlineshop_app_product_ratings")
    user = models.ForeignKey("users.UserModel", on_delete=models.CASCADE, related_name="onlineshop_app_user_ratings")
    rating = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(5)])

    def __str__(self):
        return f"{self.product.title} Rating: {self.rating} by {self.user}"

    class Meta:
        verbose_name = "Product Rating"
        verbose_name_plural = "Product Ratings"
        db_table = "onlineshop_app__product_ratings"


class ProductLike(BaseModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="onlineshop_app_product_likes")
    user = models.ForeignKey("users.UserModel", on_delete=models.CASCADE, related_name="onlineshop_app_user_likes")

    def __str__(self):
        return f"{self.product.title} liked by {self.user} {'✅' if self.is_active else '❌'}"

    class Meta:
        verbose_name = "Product Like"
        verbose_name_plural = "Product Likes"
        db_table = "onlineshop_app__product_likes"


class ProductSellDocument(BaseModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="onlineshop_app_sell_documents")
    seller_user = models.ForeignKey("users.UserModel", on_delete=models.CASCADE, related_name="onlineshop_app_products_sold")
    buyer_user = models.ForeignKey("users.UserModel", on_delete=models.CASCADE, related_name="onlineshop_app_products_bought")
    is_seller_agree = models.BooleanField(default=False)
    is_buyer_agree = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.product.title} sold from {self.seller_user} to {self.buyer_user}"

    class Meta:
        verbose_name = "Product Sell Document"
        verbose_name_plural = "Product Sell Documents"
        db_table = "onlineshop_app__product_sell_documents"


class ProductComment(BaseModel):
    reply = models.ForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True, related_name="onlineshop_app_comment_replies"
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="onlineshop_app_product_comments")
    user = models.ForeignKey("users.UserModel", on_delete=models.CASCADE, related_name="onlineshop_app_user_comments")
    comment = models.TextField()

    def __str__(self):
        return f"{self.comment[:50]} - {self.user} {'✅' if self.is_active else '❌'}"

    class Meta:
        verbose_name = "Product Comment"
        verbose_name_plural = "Product Comments"
        db_table = "onlineshop_app__product_comments"
        ordering = ("-created_at",)
