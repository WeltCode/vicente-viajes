from .services import sync_expired_states


class EstadoExpirySyncMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        sync_expired_states()
        return self.get_response(request)
