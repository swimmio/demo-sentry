import unittest

from sentry.api.validators.sentry_apps.schema import validate_component

from .util import invalid_schema


class TestVideoSchemaValidation(unittest.TestCase):
    def setUp(self):
        self.schema = {"type": "video", "url": "https://example.com/video.mov"}

    def test_valid_schema(self):
        validate_component(self.schema)

    @invalid_schema
    def test_missing_url(self):
        del self.schema["url"]
        validate_component(self.schema)

    @invalid_schema
    def test_invalid_url(self):
        self.schema["url"] = "not-a-url"
        validate_component(self.schema)
