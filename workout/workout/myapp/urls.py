from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index,name = "index"),
    path('testpoints/<str:excercise>',views.testpoints,name = "testpoints"),
    path('next',views.next,name='next')
]