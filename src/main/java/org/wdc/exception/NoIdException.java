package org.wdc.exception;

public class NoIdException extends NoEntryException {
    public NoIdException() { };

    public NoIdException(String message) {
        super(message);
    }

    public NoIdException(String message, Throwable cause) {
        super(message, cause);
    }

    public NoIdException(Throwable cause) {
        super(cause);
    }
}