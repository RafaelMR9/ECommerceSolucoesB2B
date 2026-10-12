from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/users/", include("core.urls")),
    path("api/products/", include("products.urls")),
    path("api/marketing/", include("marketing.urls")),
    path("api/support/", include("support.urls")),
    path("api/orders/", include("orders.urls")),
    path("api/suppliers/", include("suppliers.urls")),
    path("api/carriers/", include("carriers.urls")),
]
if settings.DEBUG and settings.MEDIA_STORAGE == "local":
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
