package org.wdc.service;

import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;


@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:spring/persistence-config.xml")
@Transactional(propagation = Propagation.REQUIRED, readOnly = false)
public class AssociationServiceTest {
    @Autowired
    AssociationService associationService;

    @BeforeClass
    public static void addArtefacts() {

    }

    @AfterClass
    public static void removeArtefacts() {

    }

    @Test
    public void testAddKey() {
        //associationService.addKey("key1", "key2", "newKey");
    }

    @Test
    public void testAddAssociation() {

    }

    @Test
    public void testUpdateKey() {

    }

    @Test
    public void testUpdateAssociation() {

    }

    @Test
    public void testRemoveAssociation() {

    }

    @Test
    public void testFindByKey() {
        //associationService.addKey();
    }

    @Test
    public void testFindByArtefactAndReferenceKey() {

    }

    @Test
    public void testList() {
        //System.out.println(associationService.list());
    }
}