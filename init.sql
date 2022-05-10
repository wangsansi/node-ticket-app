insert into category value(1,2070,'保洁');
insert into category value(2,2071,'安防');
insert into category value(3,2072,'园林');
insert into category value(4,2073,'客服');
insert into category value(5,2074,'维修');

mysql> select * from category;
+----+-------------+--------+
| id | category_id | name   |
+----+-------------+--------+
|  1 |        2070 | 保洁   |
|  2 |        2071 | 安防   |
|  3 |        2072 | 园林   |
|  4 |        2073 | 客服   |
|  5 |        2074 | 维修   |
+----+-------------+--------+
5 rows in set (0.00 sec)

insert into propertyManagementDepartment value(1,'保洁部',null,null,null,0,null);
insert into propertyManagementDepartment value(2,'安防部',null,null,null,0,null);
insert into propertyManagementDepartment value(3,'园林部',null,null,null,0,null);
insert into propertyManagementDepartment value(4,'客服部',null,null,null,0,null);
insert into propertyManagementDepartment value(5,'维修部',null,null,null,0,null);
insert into propertyManagementDepartment value(6,'主任部',null,null,null,0,null);

mysql> select * from propertyManagementDepartment;
+----+-----------+--------+-------+-------------+----------+-----------+
| id | name      | leader | phone | dept_status | del_flag | leader_id |
+----+-----------+--------+-------+-------------+----------+-----------+
|  1 | 保洁部    | NULL   | NULL  |        NULL |        0 |      NULL |
|  2 | 安防部    | NULL   | NULL  |        NULL |        0 |      NULL |
|  3 | 园林部    | NULL   | NULL  |        NULL |        0 |      NULL |
|  4 | 客服部    | NULL   | NULL  |        NULL |        0 |      NULL |
|  5 | 维修部    | NULL   | NULL  |        NULL |        0 |      NULL |
|  6 | 主任部    | NULL   | NULL  |        NULL |        0 |      NULL |
+----+-----------+--------+-------+-------------+----------+-----------+
6 rows in set (0.00 sec)

insert into propertyManagementPosition value(1,'主管',0);
insert into propertyManagementPosition value(2,'副主管',0);
insert into propertyManagementPosition value(3,'员工',0);
insert into propertyManagementPosition value(4,'主任',0);
insert into propertyManagementPosition value(5,'副主任',0);

mysql> select * from propertyManagementPosition;
+----+-----------+----------+
| id | name      | del_flag |
+----+-----------+----------+
|  1 | 主管      |        0 |
|  2 | 副主管    |        0 |
|  3 | 员工      |        0 |
+----+-----------+----------+
3 rows in set (0.00 sec)