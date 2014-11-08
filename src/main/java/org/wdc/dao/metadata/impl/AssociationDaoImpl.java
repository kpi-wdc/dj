package org.wdc.dao.metadata.impl;

import org.springframework.stereotype.Repository;
import org.wdc.dao.impl.HibernateDao;
import org.wdc.dao.metadata.AssociationDao;
import org.wdc.domain.metadata.Association;
import org.wdc.domain.metadata.ids.AssociationId;

@Repository("associationDao")
public class AssociationDaoImpl extends HibernateDao<Association, AssociationId>
                    implements AssociationDao {

}