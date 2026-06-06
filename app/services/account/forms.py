from django import forms
from django.contrib.auth import get_user_model

from app.services.auth.users.logic.phone import (
    PHONE_VALIDATION_ERROR,
    normalize_phone_number,
)

User = get_user_model()


class ProfileForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ["first_name", "last_name", "phone"]

    def clean_phone(self):
        phone_raw = (self.cleaned_data.get("phone") or "").strip()

        if not phone_raw:
            return None

        try:
            normalized = normalize_phone_number(phone_raw)
        except Exception:
            raise forms.ValidationError(PHONE_VALIDATION_ERROR)

        exists = (
            User.objects.filter(phone=normalized.number)
            .exclude(pk=self.instance.pk)
            .exists()
        )
        if exists:
            raise forms.ValidationError("Phone already in use")

        return normalized.number
