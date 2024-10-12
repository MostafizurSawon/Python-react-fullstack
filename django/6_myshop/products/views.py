from django.shortcuts import render

from django.db.models import Avg, Count, Sum

from .models import Product, Category


def index(request):
    categories = (
        Category.objects.all()
        .annotate(product_count=Count("product"))
        .prefetch_related("product_set")
    )

    products = Product.objects.all().order_by("price").select_related("category")

    price_avg = products.aggregate(Sum("price"))["price__sum"]

    context = {
        "categories": categories,
        "products": products,
        "price_avg": price_avg,
    }

    return render(request, "products/index.html", context)
