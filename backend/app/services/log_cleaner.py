import re


class LogCleaner:

    @staticmethod
    def clean(log: str) -> str:
        """
        Removes common CI noise while preserving
        useful failure information.
        """

        cleaned_lines = []

        for line in log.splitlines():

            line = line.strip()

            if not line:
                continue

            if re.match(r"^INFO", line):
                continue

            if re.match(r"^SUCCESS", line):
                continue

            if line == "Done":
                continue

            cleaned_lines.append(line)

        return "\n".join(cleaned_lines)