# apps/announcements_main/management/commands/populate_announcements.py

import random

from django.core.management.base import BaseCommand
from django.utils.text import slugify

from faker import Faker

from apps.announcements_main.models import Announcement
from apps.users.user_model import UserModel

fake = Faker()

WORK_TIME_CHOICES = ["full_time", "part_time", "flexable_time"]
ANNOUNCEMENT_TYPES = ["service_announcement", "work_announcement"]


def random_price():
    return random.randint(50, 1000) * 1000  # e.g., 50,000 to 1,000,000


class Command(BaseCommand):
    help = "Populate random announcements"

    def add_arguments(self, parser):
        parser.add_argument(
            "--count",
            type=int,
            default=50,
            help="Number of announcements to create",
        )

    def generate_unique_slug(self, title):
        base_slug = slugify(title)
        unique_slug = base_slug
        counter = 1
        while Announcement.admin_objects.filter(meta=unique_slug).exists():
            unique_slug = f"{base_slug}-{counter}"
            counter += 1
        return unique_slug

    def handle(self, *args, **options):
        count = options["count"]
        users = list(UserModel.objects.all())
        if not users:
            self.stdout.write(self.style.ERROR("No users found. Create users first!"))
            return

        announcements = []
        for _ in range(count):
            title = fake.sentence(nb_words=6)
            announcement_type = random.choice(ANNOUNCEMENT_TYPES)
            user = random.choice(users)
            meta = self.generate_unique_slug(title)
            price_min = random_price()
            price_max = price_min + random.randint(5, 20) * 1000
            announcement = Announcement(
                user=user,
                title=title,
                meta=meta,
                announcement_type=announcement_type,
                thumbnail="default.jpg",  # replace with a valid placeholder if needed
                price_min=price_min,
                price_max=price_max,
                dealed=random.choice([True, False]),
                region=fake.state(),
                district=fake.city(),
                address=fake.address(),
                experience=fake.paragraph(nb_sentences=2),
                work_time=random.choice(WORK_TIME_CHOICES),
                short_description=fake.text(max_nb_chars=100),
                description=fake.text(max_nb_chars=500),
            )
            announcements.append(announcement)

        Announcement.objects.bulk_create(announcements)
        self.stdout.write(self.style.SUCCESS(f"Created {len(announcements)} random announcements"))
