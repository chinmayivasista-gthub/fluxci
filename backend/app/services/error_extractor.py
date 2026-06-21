import re


class ErrorExtractor:

    @staticmethod
    def extract_error_block(log: str) -> str:
        """
        Extracts the most relevant error block
        from a cleaned CI log.
        """

        patterns = [
            r"Traceback[\s\S]*",
            r"ModuleNotFoundError.*",
            r"ImportError.*",
            r"AssertionError.*",
            r"ERROR.*",
            r"Exception.*",
        ]

        for pattern in patterns:

            match = re.search(
                pattern,
                log,
                re.MULTILINE
            )

            if match:
                return match.group(0)

        return log