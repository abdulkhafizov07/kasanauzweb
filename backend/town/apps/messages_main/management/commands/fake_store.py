import random
from datetime import date
from io import BytesIO

from django.core.files import File
from django.core.management.base import BaseCommand
from django.utils.text import slugify

import requests

from apps.onlineshop_main.models import Category, Product, ProductImage
from apps.users.models import UserModel
from apps.users.user_model import Gender

PEXELS_API_KEY = "Ez6nBTRCMbvesOKb0ZKEj8XIb1gFQAvRrynlMq3Ikb8bqd51yd7reGEt"
PEXELS_API_URL = "https://api.pexels.com/v1/search"

first_names = ["Axmad", "Nurillo", "Akbar", "Muhammadaziz", "Rone"]
last_names = ["Axmadov", "Nurilloyev", "Akbarov", "Muhammadazizov", "Ronev"]


class Command(BaseCommand):
    help = "Generate fake data for testing"

    def fetch_random_image(self, query="product"):
        headers = {"Authorization": PEXELS_API_KEY}
        params = {"query": query, "per_page": 1}
        response = requests.get(PEXELS_API_URL, headers=headers, params=params)
        data = response.json()
        if data["photos"]:
            return data["photos"][0]["src"]["original"]
        return None

    def download_image(self, url):
        response = requests.get(url)
        if response.status_code == 200:
            return BytesIO(response.content)
        return None

    def handle(self, *args, **options):
        users = []
        categories = []

        for i in range(14):
            user, created = UserModel.objects.get_or_create(
                username=f"test_context_user_{i+1}",
                defaults={
                    "first_name": random.choice(first_names),
                    "last_name": random.choice(last_names),
                    "middle_name": random.choice(first_names) + " o'g'li",
                    "phone": "+9989999999" + str(50 + i),
                    "birthday": date(random.randint(1960, 2007), random.randint(1, 12), random.randint(1, 28)),
                    "gender": Gender.MALE,
                    "region": "Python does not support",
                    "district": "Python does not support",
                    "purposes": "Application test",
                },
            )
            if created:
                print(f"User created: {user.username}")
            users.append(user)

        for i in range(16):
            category, created = Category.objects.get_or_create(
                meta=f"test_category_{i+1}", defaults={"title": f"Test category {i+1}"}
            )
            categories.append(category)

        for user in users:
            for i in range(random.randint(10, 15)):
                category = random.choice(categories)
                title = f"Product {i+1} by {user.username}"
                meta = slugify(f"{title}-{random.randint(1000,9999)}")  # ensure uniqueness
                short_description = f"Short description for {title}"
                description = f"Detailed description for {title}"
                price = random.randint(100, 500)
                price_discount = price * random.uniform(0.7, 0.9)  # optional discount

                product, created = Product.objects.get_or_create(
                    meta=meta,
                    defaults={
                        "title": title,
                        "user": user,
                        "category": category,
                        "short_description": short_description,
                        "description": description,
                        "price": price,
                        "price_discount": round(price_discount, 2),
                    },
                )
                if created:
                    print(f"Product created: {product.title}")

                image_url = self.fetch_random_image()
                if image_url:
                    image_content = self.download_image(image_url)
                    if image_content:
                        filename = f"{title.replace(' ', '_')}.jpg"
                        product_image = ProductImage.objects.create(product=product)
                        product_image.image.save(filename, File(image_content), save=True)
                        print(f"Downloaded and saved image for {product.title}")
