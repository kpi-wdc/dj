package org.wdc.exception;

public class DuplicateIdException extends DuplicateException {
    public DuplicateIdException() { }

    public DuplicateIdException(String message) {
        super(message);
    }

    public DuplicateIdException(String message, Throwable cause) {
        super(message, cause);
    }

    public DuplicateIdException(Throwable cause) {
        super(cause);
    }
}