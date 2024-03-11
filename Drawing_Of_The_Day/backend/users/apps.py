from django.apps import AppConfig


class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'backend.users'

    # ready() method automatically callled when application is ready
    def ready(self):
        # ensures custom signals handlers are connected when app is initialized
        import backend.users.signals