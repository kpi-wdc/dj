package org.wdc.exception;

public class WDCException extends Exception {
    public WDCException() { };

    public WDCException(String message) {
        super(message);
    }

    public WDCException(String message, Throwable cause) {
        super(message, cause);
    }

    public WDCException(Throwable cause) {
        super(cause);
    }
}