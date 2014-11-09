package org.wdc.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.wdc.dao.metadata.ArtefactDao;
import org.wdc.dao.metadata.ArtefactMetadataDao;
import org.wdc.dao.metadata.MetadataKeyDao;
import org.wdc.domain.metadata.Artefact;
import org.wdc.domain.metadata.ArtefactMetadata;
import org.wdc.domain.metadata.MetadataKey;
import org.wdc.domain.metadata.ids.ArtefactMetadataId;
import org.wdc.service.ArtefactMetadataService;

import java.util.List;

@Transactional(propagation = Propagation.REQUIRED, readOnly = false)
@Service("artefactMetadataService")
public class ArtefactMetadataServiceImpl implements ArtefactMetadataService {
    @Autowired
    private ArtefactMetadataDao artefactMetadataDao;

    @Autowired
    private ArtefactDao artefactDao;

    @Autowired
    private MetadataKeyDao metadataKeyDao;

    public ArtefactMetadataDao getArtefactMetadataDao() {
        return artefactMetadataDao;
    }

    public void setArtefactMetadataDao(ArtefactMetadataDao artefactMetadataDao) {
        this.artefactMetadataDao = artefactMetadataDao;
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
    public void addArtefactMetadata(String artefactKey, String metadataKey, String value) {
        Artefact artefact = artefactDao.findByKey(artefactKey);
        MetadataKey mdataKey = metadataKeyDao.findByKey(metadataKey);

        artefactMetadataDao.add(new ArtefactMetadata(new ArtefactMetadataId(artefact,
                                                                    mdataKey), value));
    }

    @Override
    public void updateArtefactMetadata(String artefactKey, String metadataKey, String newValue) {
        Artefact artefact = artefactDao.findByKey(artefactKey);
        MetadataKey mdataKey = metadataKeyDao.findByKey(metadataKey);

        artefactMetadataDao.update(new ArtefactMetadata(new ArtefactMetadataId(artefact,
                                                                mdataKey), newValue));
    }

    @Override
    public void removeArtefactMetadata(String artefactKey, String metadataKey) {
        Artefact artefact = artefactDao.findByKey(artefactKey);
        MetadataKey mdataKey = metadataKeyDao.findByKey(metadataKey);

        artefactMetadataDao.remove(new ArtefactMetadata(new ArtefactMetadataId(artefact, mdataKey)));
    }

    @Override
    public ArtefactMetadata findByArtefactAndMetadataKeys(String artefactKey, String metadataKey) {
        Artefact artefact = artefactDao.findByKey(artefactKey);
        MetadataKey mdataKey = metadataKeyDao.findByKey(metadataKey);

        return artefactMetadataDao.find(new ArtefactMetadataId(artefact, mdataKey));
    }

    @Override
    public List<ArtefactMetadata> list() {
        return artefactMetadataDao.list();
    }
}