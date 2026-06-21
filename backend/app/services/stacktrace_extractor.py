import re


class StackTraceExtractor:

    @staticmethod
    def extract(log: str) -> str | None:
        """
        Extracts a Python traceback from an error block.
        Returns None if no traceback exists.
        """

        pattern = (
            r"(Traceback \(most recent call last\):"
            r"[\s\S]*?"
            r"(?:[A-Za-z]+Error:.*))"
        )

        match = re.search(
            pattern,
            log,
            re.MULTILINE
        )

        if match:
            return match.group(1)

        return None