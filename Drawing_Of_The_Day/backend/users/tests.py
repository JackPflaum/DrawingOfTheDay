from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status


# Create your tests here.
class SignupTest(TestCase):
    def test_signup_view(self):
        # NOTE: remove '.get('signupData')' from 'signup_data = request.data.get('signupData')'
        # in signup view for test to work.

        # define signup data
        signup_data = {
            'email': 'test@email.com',
            'username': 'testuser',
            'password1': 'testpassword',
            'password2': 'testpassword',
        }

        # get signup view url path
        signup_url = reverse('signup')

        # send POST request to signup view including signup data
        response = self.client.post(signup_url, signup_data, format='json')

        # assert response status code is 201 when correct details are submitted
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # assert user was created in database
        self.assertTrue(User.objects.filter(username='testuser').exists())
