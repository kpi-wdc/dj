package org.wdc.dao.data.impl;

import org.springframework.stereotype.Repository;
import org.wdc.dao.data.AppConfigDao;
import org.wdc.dao.impl.HibernateDao;
import org.wdc.domain.data.AppConfig;

import java.util.List;

@Repository("appConfigDao")
public class AppConfigDaoImpl extends HibernateDao<AppConfig, Integer>
                                             implements AppConfigDao {
    @Override
    public void update(AppConfig entity) {
        // should be zero or one
        List<AppConfig> configs = list();
        if (!configs.isEmpty()) {
            remove(configs.get(0));
        }

        super.update(entity);
    }
}
