from django.shortcuts import render

# Create your views here.

def index(request, *args, **kwargs):
    return render(request, 'frontend/index.html') # takes request and returns html inside the frontend folder.
