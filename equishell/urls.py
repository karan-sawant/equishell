"""pushconnect URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import url, include, handler500, handler404
from home import views as home_views
from django.contrib import admin
from django.urls import path

admin.site.site_header = "Equishell"
admin.site.site_title = "Equishell"
admin.site.index_title = "Application Models"

urlpatterns = [
    path('admin-equishell@innovate/', admin.site.urls),
    url(r'^', include('home.urls')),
    url(r'^covid/', include('covid.urls')),
]


handler404 = "home.views.error404"
handler500 = "home.views.error500"