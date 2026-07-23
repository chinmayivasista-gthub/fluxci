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
            r"ModuleNotFoundError[\s\S]*",
            r"ImportError[\s\S]*",
            r"AssertionError[\s\S]*",
            r"ERROR[\s\S]*",
            r"Exception[\s\S]*",
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