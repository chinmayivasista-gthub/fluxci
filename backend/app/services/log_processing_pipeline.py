from app.schemas.log_processing import LogProcessingResult

from app.services.log_cleaner import LogCleaner
from app.services.error_extractor import ErrorExtractor
from app.services.stacktrace_extractor import StackTraceExtractor
from app.services.exitcode_extractor import ExitCodeExtractor
from app.services.failure_section_extractor import (
    FailureSectionExtractor,
)


class LogProcessingPipeline:

    def process(
        self,
        raw_log: str
    ) -> LogProcessingResult:

        cleaned_log = LogCleaner.clean(raw_log)

        error_block = ErrorExtractor.extract_error_block(
            cleaned_log
        )

        stack_trace = StackTraceExtractor.extract(
            error_block
        )

        exit_code = ExitCodeExtractor.extract(
            error_block
        )

        failure_section = (
            FailureSectionExtractor.extract(
                cleaned_log
            )
        )

        return LogProcessingResult(
            cleaned_log=cleaned_log,
            error_block=error_block,
            stack_trace=stack_trace,
            exit_code=exit_code,
            failure_section=failure_section,
        )