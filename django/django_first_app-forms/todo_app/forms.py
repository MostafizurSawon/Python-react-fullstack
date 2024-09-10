from django import forms
from .models import Task,Book, Author

class TaskForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = [
            "title",
            "description",
            "completed",
            "due_date",
        ]

    due_date = forms.DateField(widget=forms.DateInput(attrs={"type": "date"}))
    description = forms.CharField(widget=forms.TextInput)
    
class BookForm(forms.ModelForm):
    class Meta:
        model = Book
        fields = [
            "title",
            "description",
            "publication_date",
            "author"
        ]

    # description = forms.CharField(widget=forms.TextInput)
    publication_date = forms.DateField(widget=forms.DateInput(attrs={"type": "date"}))
    
class AuthorForm(forms.ModelForm):
    class Meta:
        model = Author
        fields = '__all__'


class TaskUpdateForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = [
            "title",
            "description",
            "completed",
            "due_date",
        ]

    due_date = forms.DateField(
        widget=forms.DateInput(attrs={"type": "date"}),
        required=True,
    )
    description = forms.CharField(widget=forms.TextInput)
    title = forms.CharField(widget=forms.TextInput(attrs={"readonly": "true"}))