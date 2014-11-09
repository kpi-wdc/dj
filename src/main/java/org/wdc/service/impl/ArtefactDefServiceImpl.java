package org.wdc.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.wdc.dao.metadata.ArtefactDao;
import org.wdc.dao.metadata.ArtefactDefDao;
import org.wdc.dao.metadata.MetadataKeyDao;
import org.wdc.domain.metadata.Artefact;
import org.wdc.domain.metadata.ArtefactDef;
import org.wdc.domain.metadata.MetadataKey;
import org.wdc.domain.metadata.ids.ArtefactDefId;
import org.wdc.service.ArtefactDefService;

import java.util.List;

@Transactional(propagation = Propagation.REQUIRED, readOnly = false)
@Service("artefactDefService")
public class ArtefactDefServiceImpl implements ArtefactDefService {
    @Autowired
    private ArtefactDefDao artefactDefDao;

    @Autowired
    private ArtefactDao artefactDao;

    @Autowired
    private MetadataKeyDao metadataKeyDao;

    public ArtefactDefDao getArtefactDefDao() {
        return artefactDefDao;
    }

    public void setArtefactDefDao(ArtefactDefDao artefactDefDao) {
        this.artefactDefDao = artefactDefDao;
    }

    public ArtefactDao getArtefactDao() {
        return artefactDao;
    }

    public void setArtefactDao(ArtefactDao artefactDao) {
        this.artefactDao = artefactDao;
    }

    public MetadataKeyDao getMetadataKeyDao() {
        return metadataKeyDao;
    }

    public void setMetadataKeyDao(MetadataKeyDao metadataKeyDao) {
        this.metadataKeyDao = metadataKeyDao;
    }

    @Override
    public void addArtefactDef(String artefactKey, String metadataKey, boolean required, boolean unique, String defaultValue) {
        Artefact artefact = artefactDao.findByKey(artefactKey);
        MetadataKey mdataKey = metadataKeyDao.findByKey(metadataKey);

        artefactDefDao.add(new ArtefactDef(new ArtefactDefId(artefact, mdataKey),
                required, unique, defaultValue));
    }

    @Override
    public void updateArtefactDef(String artefactKey, String metadataKey, boolean required, boolean unique, String defaultValue) {
        Artefact artefact = artefactDao.findByKey(artefactKey);
        MetadataKey mdataKey = metadataKeyDao.findByKey(metadataKey);

        artefactDefDao.update(new ArtefactDef(new ArtefactDefId(artefact, mdataKey),
                required, unique, defaultValue));
    }

    @Override
    public void removeArtefactDef(String artefactKey, String metadataKey) {
        Artefact artefact = artefactDao.findByKey(artefactKey);
        MetadataKey mdataKey = metadataKeyDao.findByKey(metadataKey);

        artefactDefDao.remove(new ArtefactDef(new ArtefactDefId(artefact, mdataKey)));
    }

    @Override
    public ArtefactDef findByArtefactAndMetadataKeys(String artefactKey, String metadataKey) {
        Artefact artefact = artefactDao.findByKey(artefactKey);
        MetadataKey mdataKey = metadataKeyDao.findByKey(metadataKey);

        return artefactDefDao.find(new ArtefactDefId(artefact, mdataKey));
    }

    @Override
    public List<ArtefactDef> list() {
        return artefactDefDao.list();
    }
}