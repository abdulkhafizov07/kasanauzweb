from rest_framework import serializers


class OnlineShopStatisticsSerializer(serializers.Serializer):
    total_products = serializers.IntegerField()
    total_sold = serializers.IntegerField()
    category_stats = serializers.DictField(child=serializers.IntegerField())
    unverified_count = serializers.IntegerField()
    visible_products = serializers.IntegerField()
    invisible_products = serializers.IntegerField()
    banned_products = serializers.IntegerField()
