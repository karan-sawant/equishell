from django.shortcuts import render, redirect

# Create your views here.
def index(request):
    # return redirect('covid.index')
    return render(request, 'home/index.html')

def error404(exception, request):
    return render(request, 'home/404.html', status=404)

def error500(request):
    return render(request, 'home/500.html', status=500)