package org.wdc.dao.impl;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.wdc.dao.GenericDao;

import java.io.Serializable;
import java.lang.reflect.ParameterizedType;
import java.util.List;

/**
 * Basic DAO operations dependent with Hibernate's specific classes
 * @see SessionFactory
 */
@Transactional(propagation= Propagation.REQUIRED, readOnly=false)
public class HibernateDao<E, K extends Serializable> implements GenericDao<E, K> {
    private SessionFactory sessionFactory;
    protected Class<? extends E> daoType;

    public HibernateDao() {
        daoType = (Class<E>) ((ParameterizedType) getClass().getGenericSuperclass())
                .getActualTypeArguments()[0];
    }

    @Autowired
    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    protected Session currentSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void add(E entity) {
        currentSession().save(entity);
    }

    @Override
    public void update(E entity) {
        currentSession().saveOrUpdate(entity);
    }

    @Override
    public void remove(E entity) {
        currentSession().delete(entity);
    }

    @Override
    public E find(K key) {
        return (E) currentSession().get(daoType, key);
    }

    @Override
    public List<E> list() {
        return currentSession().createCriteria(daoType).list();
    }
}