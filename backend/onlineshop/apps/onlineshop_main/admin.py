from django.contrib import admin

from .models import Category, Product, ProductComment, ProductImage, ProductRating, ProductSellDocument

# Register your models here.


admin.site.register({Product, ProductComment, ProductImage, ProductRating, ProductSellDocument, Category})
