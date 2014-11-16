package org.wdc.exception;

public class NoEntryException extends WDCException {
    public NoEntryException() { };

    public NoEntryException(String message) {
        super(message);
    }

    public NoEntryException(String message, Throwable cause) {
        super(message, cause);
    }

    public NoEntryException(Throwable cause) {
        super(cause);
    }
}