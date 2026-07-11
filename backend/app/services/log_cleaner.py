import re


class LogCleaner:
    @staticmethod
    def clean(log: str) -> str:
        """
        Cleans CI/CD logs by:
        - Removing empty lines
        - Removing INFO logs
        - Removing SUCCESS logs
        - Removing standalone 'Done' lines
        - Removing ANSI escape sequences
        - Normalizing whitespace
        """

        # Remove ANSI escape codes
        log = re.sub(r"\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])", "", log)

        cleaned_lines = []

        for line in log.splitlines():
            # Remove leading/trailing whitespace
            line = line.strip()

            # Skip empty lines
            if not line:
                continue

            # Skip common CI noise
            if re.match(r"^INFO\b", line, re.IGNORECASE):
                continue

            if re.match(r"^SUCCESS\b", line, re.IGNORECASE):
                continue

            if line.lower() == "done":
                continue

            # Collapse multiple spaces/tabs into one space
            line = re.sub(r"\s+", " ", line)

            cleaned_lines.append(line)

        cleaned_log = "\n".join(cleaned_lines)

        return cleaned_log.strip()