from django.shortcuts import render
from Crypto.Cipher import AES
from Crypto import Random
import base64
import json

# Create your views here.
def index(request):
    return render(request, 'covid/index.html')