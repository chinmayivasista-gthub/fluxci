import re


class ExitCodeExtractor:

    @staticmethod
    def extract(log: str) -> int | None:
        """
        Extracts an exit code from a CI log.
        """

        patterns = [
            r"exit code[: ]+(\d+)",
            r"Exited with code (\d+)",
            r"Process exited with code (\d+)",
            r"returned non-zero exit status (\d+)"
        ]

        for pattern in patterns:

            match = re.search(
                pattern,
                log,
                re.IGNORECASE
            )

            if match:
                return int(match.group(1))

        return None