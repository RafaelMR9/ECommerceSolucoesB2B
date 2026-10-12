from unittest import TestCase

from scripts.check_private_files import contains_literal_secret


class PrivateFileChecks(TestCase):
    def test_literal_secret_assignment_is_detected(self):
        for name in ("SECRET_KEY", "DJANGO_SECRET_KEY", "CLOUDINARY_API_SECRET"):
            with self.subTest(name=name):
                self.assertTrue(
                    contains_literal_secret(f"{name} = 'fictional-test-value'")
                )

    def test_annotated_secret_assignment_is_detected(self):
        self.assertTrue(
            contains_literal_secret("SECRET_KEY: str = 'fictional-test-value'")
        )

    def test_environment_configuration_is_allowed(self):
        self.assertFalse(
            contains_literal_secret("SECRET_KEY = os.getenv('DJANGO_SECRET_KEY')")
        )

    def test_mock_keyword_is_not_treated_as_an_assignment(self):
        self.assertFalse(
            contains_literal_secret(
                'patch.dict("os.environ", CLOUDINARY_API_SECRET="fake-secret")'
            )
        )

    def test_invalid_python_cannot_be_silently_accepted(self):
        with self.assertRaises(SyntaxError):
            contains_literal_secret("SECRET_KEY =")
