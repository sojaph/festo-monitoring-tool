CREATE TABLE tblResource(
   ResourceID         INTEGER  NOT NULL PRIMARY KEY 
  ,ResourceName       VARCHAR(12) NOT NULL
  ,Description        VARCHAR(37) NOT NULL
  ,PlcType            INTEGER  NOT NULL
  ,IP                 VARCHAR(11) NOT NULL
  ,Picture            VARCHAR(51)
  ,ParallelProcessing VARCHAR(5) NOT NULL
  ,Automatic          VARCHAR(5) NOT NULL
  ,WebPage            VARCHAR(36)
  ,DefaultBrowser     VARCHAR(5) NOT NULL
  ,TopologyType       INTEGER  NOT NULL
);
INSERT INTO tblResource(ResourceID,ResourceName,Description,PlcType,IP,Picture,ParallelProcessing,Automatic,WebPage,DefaultBrowser,TopologyType) VALUES (0,'no resource','no resource',1,'127.0.0.1',NULL,'FALSE','FALSE',NULL,'FALSE',0),
 (61,'ASRS32','high bay rack for pallets',2,'192.168.0.1','Pictures\TransferFactory\ASRS32.png','FALSE','FALSE',NULL,'TRUE',2),
 (63,'AM-DRILL-CPS','application module drilling with CECC',1,'192.168.0.5','Pictures\TransferFactory\ModulBohrenCECCNeu2015.png','FALSE','FALSE','http://192.168.0.42:8080/webvisu.htm','TRUE',1),
 (64,'RASS-ABB','robot assembly',2,'192.168.0.3','Pictures\TransferFactory\RoboterAssembly.png','FALSE','FALSE','http://192.168.0.93/','FALSE',1),
 (68,'AM-SBOQ-IO','application module camera inspection',1,'192.168.0.6','Pictures\TransferFactory\ModulKameraPruefen.png','FALSE','FALSE','http://192.168.0.97/','FALSE',1),
 (70,'MANUAL','manual workplace',1,'192.168.0.6','Pictures\TransferFactory\BypassModul.png','FALSE','FALSE',NULL,'FALSE',1);
