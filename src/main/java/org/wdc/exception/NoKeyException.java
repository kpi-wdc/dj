package org.wdc.exception;

public class NoKeyException extends NoEntryException {
    public NoKeyException() { };

    public NoKeyException(String message) {
        super(message);
    }

    public NoKeyException(String message, Throwable cause) {
        super(message, cause);
    }

    public NoKeyException(Throwable cause) {
        super(cause);
    }
}