from django import forms
from .models import Document


class DocumentForm(forms.ModelForm):
    class Meta:
        model = Document
        fields = ["title", "file", "file2"]
        
    def clean_file(self):
        file = self.cleaned_data.get('file')

        # You can also check the file extension
        allowed_extensions = ['pdf', 'png', 'jpg', 'jpeg']

        # Extract the file extension
        extension = file.name.split('.')[-1].lower()
        if extension not in allowed_extensions:
            raise forms.ValidationError(f"File type not supported. Allowed types: {', '.join(allowed_extensions)}")

        # Optional: For more robust checking, you can use python-magic to verify file content
        # mime = magic.Magic(mime=True)
        # file_type = mime.from_buffer(file.read())
        # if file_type not in ['application/pdf', 'image/jpeg', 'image/png']:
        #     raise forms.ValidationError("Unsupported file type. Please upload a PDF, JPEG, or PNG image.")
        
        return file
