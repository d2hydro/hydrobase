from .config import STATIC_DIR, LOG_DIR
import logging


def get_html(file_name, kwargs={}):
    with STATIC_DIR / file_name as src:
        return src.read_text().format(kwargs)


def get_logger(log_level="INFO", log_file=None):
    logger = logging.getLogger(__name__)
    logger.setLevel(getattr(logging, log_level))
    if log_file is not None:
        log_file = LOG_DIR / log_file
        fh = logging.FileHandler(log_file)
        fh.setFormatter(
            logging.Formatter("%(asctime)s %(name)s %(levelname)s - %(message)s")
        )
        fh.setLevel(getattr(logging, log_level))
        logger.addHandler(fh)
    return logger
