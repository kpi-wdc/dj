package org.wdc.domain.data;

import javax.persistence.*;
import java.util.Arrays;

@Entity
@Table(schema = "data", name = "appjson")
public class AppConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "app_id")
    private int appId;

    @Column(name = "app_content")
    private byte[] data;

    public AppConfig() {
    }

    public AppConfig(byte[] data) {
        this.data = data;
    }

    public int getAppId() {
        return appId;
    }

    public void setAppId(int appId) {
        this.appId = appId;
    }

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        AppConfig appConfig = (AppConfig) o;

        if (appId != appConfig.appId) return false;
        if (!Arrays.equals(data, appConfig.data)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = appId;
        result = 31 * result + (data != null ? Arrays.hashCode(data) : 0);
        return result;
    }
}
