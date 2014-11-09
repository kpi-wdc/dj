package org.wdc.service.impl;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.wdc.dao.metadata.ArtefactDao;
import org.wdc.dao.metadata.AssociationDao;
import org.wdc.domain.metadata.Artefact;
import org.wdc.domain.metadata.Association;
import org.wdc.domain.metadata.ids.AssociationId;
import org.wdc.service.AssociationService;

import java.util.List;

@Transactional(propagation= Propagation.REQUIRED, readOnly=false)
@Service("associationService")
public class AssociationServiceImpl implements AssociationService {
    @Autowired
    private SessionFactory sessionFactory;

    @Autowired
    private ArtefactDao artefactDao;

    @Autowired
    private AssociationDao associationDao;

    public SessionFactory getSessionFactory() {
        return sessionFactory;
    }

    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    public ArtefactDao getArtefactDao() {
        return artefactDao;
    }

    public void setArtefactDao(ArtefactDao artefactDao) {
        this.artefactDao = artefactDao;
    }

    public AssociationDao getAssociationDao() {
        return associationDao;
    }

    public void setAssociationDao(AssociationDao associationDao) {
        this.associationDao = associationDao;
    }

    private Session currentSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void addKey(String artefactKey, String referenceKey, String key) {
        Artefact artefact = artefactDao.findByKey(artefactKey);
        Artefact reference = artefactDao.findByKey(referenceKey);

        associationDao.add(new Association(new AssociationId(artefact, reference), key));
    }

    @Override
    public void addAssociation(String artefactKey, String referenceKey, String key, String localField, String foreignField) {
        Artefact artefact = artefactDao.findByKey(artefactKey);
        Artefact reference = artefactDao.findByKey(referenceKey);
        associationDao.add(new Association(new AssociationId(artefact, reference),
                localField, foreignField, key));
    }

    @Override
    public void updateKey(String artefactKey, String referenceKey, String newKey) {
        Artefact artefact = artefactDao.findByKey(artefactKey);
        Artefact reference = artefactDao.findByKey(referenceKey);

        associationDao.update(new Association(new AssociationId(artefact, reference), newKey));
    }

    @Override
    public void updateAssociation(String artefactKey, String referenceKey, String newKey, String newLocalField, String newForeignField) {
        Artefact artefact = artefactDao.findByKey(artefactKey);
        Artefact reference = artefactDao.findByKey(referenceKey);
        associationDao.update(new Association(new AssociationId(artefact, reference),
                newLocalField, newForeignField, newKey));
    }

    @Override
    public void removeAssociation(String artefactKey, String referenceKey) {
        Artefact artefact = artefactDao.findByKey(artefactKey);
        Artefact reference = artefactDao.findByKey(referenceKey);

        associationDao.remove(new Association(new AssociationId(artefact, reference)));
    }

    @Override
    public Association findByKey(String key) {
        Query query = currentSession().createQuery("from Association a where a.key = :key");
        query.setParameter("key", key);
        return (Association) query.uniqueResult();
    }

    @Override
    public Association findByArtefactAndReferenceKeys(String artefactKey, String referenceKey) {
        Artefact artefact = artefactDao.findByKey(artefactKey);
        Artefact reference = artefactDao.findByKey(referenceKey);

        return associationDao.find(new AssociationId(artefact, reference));
    }

    @Override
    public List<Association> list() {
        return associationDao.list();
    }
}