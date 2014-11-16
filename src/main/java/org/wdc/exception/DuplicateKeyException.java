package org.wdc.exception;

public class DuplicateKeyException extends DuplicateException {
    public DuplicateKeyException() { }

    public DuplicateKeyException(String message) {
        super(message);
    }

    public DuplicateKeyException(String message, Throwable cause) {
        super(message, cause);
    }

    public DuplicateKeyException(Throwable cause) {
        super(cause);
    }
}