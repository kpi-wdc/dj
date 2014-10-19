package org.wdc.domain.metadata;

import javax.persistence.*;

/**
 * Created by vii on 19.10.14.
 */

@Entity
@Table(schema = "metadata", name = "metadatakey")
public class MetadataKey {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "metadatakey_id")
    private int metadataKeyId;

    @Column(name = "key")
    private String key;

    public MetadataKey() { }

    public MetadataKey(String key) {
        this.key = key;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        MetadataKey that = (MetadataKey) o;

        if (metadataKeyId != that.metadataKeyId) return false;
        if (key != null ? !key.equals(that.key) : that.key != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = metadataKeyId;
        result = 31 * result + (key != null ? key.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "MetadataKey{" +
                "metadataKeyId=" + metadataKeyId +
                ", key='" + key + '\'' +
                '}';
    }
}
