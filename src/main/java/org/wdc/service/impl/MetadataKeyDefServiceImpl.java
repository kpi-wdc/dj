package org.wdc.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.wdc.dao.metadata.MetadataKeyDao;
import org.wdc.dao.metadata.MetadataKeyDefDao;
import org.wdc.domain.metadata.MetadataKey;
import org.wdc.domain.metadata.MetadataKeyDef;
import org.wdc.domain.metadata.ids.MetadataKeyDefId;
import org.wdc.service.MetadataKeyDefService;

import java.util.List;

@Transactional(propagation = Propagation.REQUIRED, readOnly = false)
@Service("metadataKeyDefService")
public class MetadataKeyDefServiceImpl implements MetadataKeyDefService {
    @Autowired
    private MetadataKeyDefDao metadataKeyDefDao;

    @Autowired
    private MetadataKeyDao metadataKeyDao;

    public MetadataKeyDefDao getMetadataKeyDefDao() {
        return metadataKeyDefDao;
    }

    public void setMetadataKeyDefDao(MetadataKeyDefDao metadataKeyDefDao) {
        this.metadataKeyDefDao = metadataKeyDefDao;
    }

    public MetadataKeyDao getMetadataKeyDao() {
        return metadataKeyDao;
    }

    public void setMetadataKeyDao(MetadataKeyDao metadataKeyDao) {
        this.metadataKeyDao = metadataKeyDao;
    }

    @Override
    public void addMetadataKeyDef(String metadataKey, String defKey, String value) {
        MetadataKey mdataKey = metadataKeyDao.findByKey(metadataKey);
        MetadataKey def = metadataKeyDao.findByKey(defKey);

        metadataKeyDefDao.add(new MetadataKeyDef(new MetadataKeyDefId(mdataKey, def), value));
    }

    @Override
    public void updateMetadataKeyDef(String metadataKey, String defKey, String newValue) {
        MetadataKey mdataKey = metadataKeyDao.findByKey(metadataKey);
        MetadataKey def = metadataKeyDao.findByKey(defKey);

        metadataKeyDefDao.update(new MetadataKeyDef(new MetadataKeyDefId(mdataKey, def), newValue));
    }

    @Override
    public void removeMetadataKeyDef(String metadataKey, String defKey) {
        MetadataKey mdataKey = metadataKeyDao.findByKey(metadataKey);
        MetadataKey def = metadataKeyDao.findByKey(defKey);

        metadataKeyDefDao.remove(new MetadataKeyDef(new MetadataKeyDefId(mdataKey, def)));
    }

    @Override
    public MetadataKeyDef findByMetadataKeyAndDefKeys(String metadataKey, String defKey) {
        MetadataKey mdataKey = metadataKeyDao.findByKey(metadataKey);
        MetadataKey def = metadataKeyDao.findByKey(defKey);

        return metadataKeyDefDao.find(new MetadataKeyDefId(mdataKey, def));
    }

    @Override
    public List<MetadataKeyDef> list() {
        return metadataKeyDefDao.list();
    }
}