import re


class FailureSectionExtractor:

    @staticmethod
    def extract(log: str) -> str:
        """
        Extracts the section of the log containing
        the failure.
        """

        patterns = [
            r"==>.*?(?=\n==>|\Z)",
            r"##\[group\].*?##\[endgroup\]",
            r"Run .*?(?=\nRun |\Z)"
        ]

        for pattern in patterns:

            matches = re.finditer(
                pattern,
                log,
                re.DOTALL
            )

            for match in matches:

                section = match.group(0)

                if (
                    "error" in section.lower()
                    or "exception" in section.lower()
                    or "failed" in section.lower()
                    or "traceback" in section.lower()
                ):
                    return section

        return log