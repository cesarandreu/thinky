var config = require(__dirname+'/../config.js');

var thinky = require(__dirname+'/../lib/thinky.js')(config);
var r = thinky.r;

var util = require(__dirname+'/util.js');
var assert = require('assert');
var Promise = require('bluebird');

describe('Advanced cases', function(){
    describe('saveAll', function(){
        it('hasOne - belongsTo', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String,
                otherId: String
            });

            Model.hasOne(OtherModel, "has", "id", "otherId");
            OtherModel.belongsTo(Model, "belongsTo", "otherId", "id");

            var values = {};
            var otherValues = {};
            var doc = new Model(values);
            var otherDoc = new OtherModel(otherValues);

            doc.has = otherDoc;

            doc.saveAll().then(function(result) {
                assert.strictEqual(doc, result);
                assert.equal(typeof result.id, 'string')
                assert.equal(typeof result.has.id, 'string')
                assert.equal(result.id, result.has.otherId)

                assert.strictEqual(result, doc);
                assert.strictEqual(result.has, doc.has);
                assert.strictEqual(doc.has, otherDoc);

                Model.get(doc.id).getJoin().run().then(function(result) {
                    assert.equal(result.id, doc.id)
                    assert.equal(result.has.id, doc.has.id)
                    assert.equal(result.has.otherId, doc.has.otherId)
                    OtherModel.get(otherDoc.id).getJoin().run().then(function(result) {
                        assert.equal(result.id, otherDoc.id);
                        assert.equal(result.belongsTo.id, doc.id);
                        done()
                    })
                });
            }).error(done);
        });
        it('hasOne - belongsTo', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String,
                otherId: String
            });

            Model.hasOne(OtherModel, "has", "id", "otherId");
            OtherModel.belongsTo(Model, "belongsTo", "otherId", "id");

            var values = {};
            var otherValues = {};
            var doc = new Model(values);
            var otherDoc = new OtherModel(otherValues);

            doc.has = otherDoc;
            otherDoc.belongsTo = doc;

            doc.saveAll().then(function(result) {
                assert.equal(typeof result.id, 'string')
                assert.equal(typeof result.has.id, 'string')
                assert.equal(result.id, result.has.otherId)

                assert.strictEqual(result, doc);
                assert.strictEqual(result.has, doc.has);
                assert.strictEqual(doc.has, otherDoc);

                Model.get(doc.id).getJoin().run().then(function(result) {
                    assert.equal(result.id, doc.id)
                    assert.equal(result.has.id, doc.has.id)
                    assert.equal(result.has.otherId, doc.has.otherId)
                    OtherModel.get(otherDoc.id).getJoin().run().then(function(result) {
                        assert.equal(result.id, otherDoc.id);
                        assert.equal(result.belongsTo.id, doc.id);
                        done()
                    })
                });
            }).error(done);
        });
        it('belongsTo - hasOne', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String,
                otherId: String
            });

            Model.hasOne(OtherModel, "has", "id", "otherId");
            OtherModel.belongsTo(Model, "belongsTo", "otherId", "id");

            var values = {};
            var otherValues = {};
            var doc = new Model(values);
            var otherDoc = new OtherModel(otherValues);

            otherDoc.belongsTo = doc;

            otherDoc.saveAll().then(function(result) {
                assert.equal(typeof result.id, 'string')
                assert.equal(typeof result.belongsTo.id, 'string')
                assert.equal(result.otherId, result.belongsTo.id)

                assert.strictEqual(result, otherDoc);
                assert.strictEqual(result.belongsTo, otherDoc.belongsTo);
                assert.strictEqual(otherDoc.belongsTo, doc);

                Model.get(doc.id).getJoin().run().then(function(result) {
                    assert.equal(result.id, doc.id)
                    assert.equal(result.has.id, otherDoc.id)
                    assert.equal(result.has.otherId, otherDoc.otherId)
                    OtherModel.get(otherDoc.id).getJoin().run().then(function(result) {
                        assert.equal(result.id, otherDoc.id);
                        assert.equal(result.belongsTo.id, doc.id);
                        done()
                    })
                });
            }).error(done);
        });
        it('belongsTo - hasOne -- circular references', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String,
                otherId: String
            });

            Model.hasOne(OtherModel, "has", "id", "otherId");
            OtherModel.belongsTo(Model, "belongsTo", "otherId", "id");

            var values = {};
            var otherValues = {};
            var doc = new Model(values);
            var otherDoc = new OtherModel(otherValues);

            otherDoc.belongsTo = doc;
            doc.has = otherDoc;

            otherDoc.saveAll().then(function(result) {
                assert.equal(typeof result.id, 'string')
                assert.equal(typeof result.belongsTo.id, 'string')
                assert.equal(result.otherId, result.belongsTo.id)

                assert.strictEqual(result, otherDoc);
                assert.strictEqual(result.belongsTo, otherDoc.belongsTo);
                assert.strictEqual(otherDoc.belongsTo, doc);

                Model.get(doc.id).getJoin().run().then(function(result) {
                    assert.equal(result.id, doc.id)
                    assert.equal(result.has.id, otherDoc.id)
                    assert.equal(result.has.otherId, otherDoc.otherId)
                    OtherModel.get(otherDoc.id).getJoin().run().then(function(result) {
                        assert.equal(result.id, otherDoc.id);
                        assert.equal(result.belongsTo.id, doc.id);
                        done()
                    })
                });
            }).error(done);
        });
        it('hasMany - belongsTo', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String,
                otherId: String
            });

            Model.hasMany(OtherModel, "has", "id", "otherId");
            OtherModel.belongsTo(Model, "belongsTo", "otherId", "id");

            var values = {};
            var otherValues = {};
            var doc = new Model(values);
            var otherDocs = [new OtherModel(otherValues), new OtherModel(otherValues), new OtherModel(otherValues)];

            doc.has = otherDocs;

            doc.saveAll().then(function(result) {
                assert.equal(typeof result.id, 'string');
                assert.equal(result.has.length, 3);
                for(var i=0; i<result.has.length; i++) {
                    assert.equal(typeof result.has[i].id, 'string')
                    assert.equal(result.has[i].otherId, result.id)
                }

                assert.strictEqual(result, doc);
                for(var i=0; i<result.has.length; i++) {
                    assert.strictEqual(result.has[i], doc.has[i]);
                }
                assert.strictEqual(doc.has, otherDocs);

                util.sortById(otherDocs);
                Model.get(doc.id).getJoin({has: { _order: "id"}}).run().then(function(result) {
                    assert.equal(result.id, doc.id);
                    assert.equal(result.has[0].id, doc.has[0].id);
                    assert.equal(result.has[1].id, doc.has[1].id);
                    assert.equal(result.has[2].id, doc.has[2].id);

                    assert.equal(result.has[0].otherId, result.id);
                    assert.equal(result.has[1].otherId, result.id);
                    assert.equal(result.has[2].otherId, result.id);

                    OtherModel.getAll(doc.id, {index: "otherId"}).getJoin().run().then(function(result) {
                        assert.equal(result.length, 3);
                        done()
                    })
                });
            }).error(done);
        });
        it('hasMany - belongsTo', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String,
                otherId: String
            });

            Model.hasMany(OtherModel, "has", "id", "otherId");
            OtherModel.belongsTo(Model, "belongsTo", "otherId", "id");

            var values = {};
            var otherValues = {};
            var doc = new Model(values);
            var otherDocs = [new OtherModel(otherValues), new OtherModel(otherValues), new OtherModel(otherValues)];

            doc.has = otherDocs;
            otherDocs[0].belongsTo = doc;
            otherDocs[1].belongsTo = doc;
            otherDocs[2].belongsTo = doc;

            doc.saveAll().then(function(result) {
                assert.equal(typeof result.id, 'string');
                assert.equal(result.has.length, 3);
                for(var i=0; i<result.has.length; i++) {
                    assert.equal(typeof result.has[i].id, 'string')
                    assert.equal(result.has[i].otherId, result.id)
                }

                assert.strictEqual(result, doc);
                for(var i=0; i<result.has.length; i++) {
                    assert.strictEqual(result.has[i], doc.has[i]);
                }
                assert.strictEqual(doc.has, otherDocs);

                util.sortById(otherDocs);
                Model.get(doc.id).getJoin({has: { _order: "id"}}).run().then(function(result) {
                    assert.equal(result.id, doc.id);
                    assert.equal(result.has[0].id, doc.has[0].id);
                    assert.equal(result.has[1].id, doc.has[1].id);
                    assert.equal(result.has[2].id, doc.has[2].id);

                    assert.equal(result.has[0].otherId, result.id);
                    assert.equal(result.has[1].otherId, result.id);
                    assert.equal(result.has[2].otherId, result.id);

                    OtherModel.getAll(doc.id, {index: "otherId"}).getJoin().run().then(function(result) {
                        assert.equal(result.length, 3);
                        done()
                    })
                });
            }).error(done);
        });
        it('belongsTo - hasMany -- circular references', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String,
                otherId: String
            });

            Model.hasMany(OtherModel, "has", "id", "otherId");
            OtherModel.belongsTo(Model, "belongsTo", "otherId", "id");

            var values = {};
            var otherValues = {};
            var doc = new Model(values);
            var otherDocs = [new OtherModel(otherValues), new OtherModel(otherValues), new OtherModel(otherValues)];

            doc.has = otherDocs;
            otherDocs[0].belongsTo = doc;
            otherDocs[1].belongsTo = doc;
            otherDocs[2].belongsTo = doc;

            otherDocs[0].saveAll().then(function(result) {
                assert.equal(typeof otherDocs[0].id, 'string');
                assert.equal(otherDocs[0].belongsTo.id, doc.id);

                otherDocs[1].saveAll().then(function(result) {
                    assert.equal(typeof otherDocs[1].id, 'string');
                    assert.equal(otherDocs[1].belongsTo.id, doc.id);

                    otherDocs[2].saveAll().then(function(result) {
                        assert.equal(typeof otherDocs[2].id, 'string');
                        assert.equal(otherDocs[2].belongsTo.id, doc.id);

                        util.sortById(otherDocs);
                        Model.get(doc.id).getJoin({has: { _order: "id"}}).run().then(function(result) {
                            assert.equal(result.id, doc.id);
                            assert.equal(result.has[0].id, doc.has[0].id);
                            assert.equal(result.has[1].id, doc.has[1].id);
                            assert.equal(result.has[2].id, doc.has[2].id);

                            assert.equal(result.has[0].otherId, result.id);
                            assert.equal(result.has[1].otherId, result.id);
                            assert.equal(result.has[2].otherId, result.id);

                            OtherModel.getAll(doc.id, {index: "otherId"}).getJoin().run().then(function(result) {
                                assert.equal(result.length, 3);
                                done()
                            })
                        });
                    });
                });
            }).error(done);
        });
        it('hasAndBelongsToMany -- primary keys', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String
            });

            Model.hasAndBelongsToMany(OtherModel, "links", "id", "id");
            OtherModel.hasAndBelongsToMany(Model, "links", "id", "id");

            var values = {};
            var otherValues = {};
            var doc1 = new Model({});
            var doc2 = new Model({});
            var otherDoc1 = new OtherModel({});
            var otherDoc2 = new OtherModel({});
            var otherDoc3 = new OtherModel({});
            var otherDoc4 = new OtherModel({});

            doc1.links = [otherDoc1, otherDoc2, otherDoc4]
            doc2.links = [otherDoc2, otherDoc3, otherDoc4]

            doc1.saveAll().then(function(result) {
                util.sortById(doc1.links);
                doc2.saveAll().then(function(result) {
                    util.sortById(doc2.links);
                    Model.get(doc1.id).getJoin({links: { _order: "id"}}).run().then(function(result) {
                        assert.equal(result.id, doc1.id);
                        assert.equal(result.links[0].id, doc1.links[0].id);
                        assert.equal(result.links[1].id, doc1.links[1].id);
                        assert.equal(result.links[2].id, doc1.links[2].id);
                        Model.get(doc2.id).getJoin({links: { _order: "id"}}).run().then(function(result) {
                            assert.equal(result.id, doc2.id);
                            assert.equal(result.links[0].id, doc2.links[0].id);
                            assert.equal(result.links[1].id, doc2.links[1].id);
                            assert.equal(result.links[2].id, doc2.links[2].id);
                            done()
                        })
                    });
                });
            }).error(done);
        });

        it('hasAndBelongsToMany -- primary keys -- circular references', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String
            });

            Model.hasAndBelongsToMany(OtherModel, "links", "id", "id");
            
            OtherModel.hasAndBelongsToMany(Model, "links2", "id", "id");

            var values = {};
            var otherValues = {};
            var doc1 = new Model({});
            var doc2 = new Model({});
            var otherDoc1 = new OtherModel({});
            var otherDoc2 = new OtherModel({});
            var otherDoc3 = new OtherModel({});
            var otherDoc4 = new OtherModel({});

            doc1.links = [otherDoc1, otherDoc2, otherDoc4]
            doc2.links = [otherDoc2, otherDoc3, otherDoc4]
            otherDoc1.links2 = [doc1];
            otherDoc2.links2 = [doc1, doc2];
            otherDoc3.links2 = [doc2];
            otherDoc4.links2 = [doc1, doc2];

            doc1.saveAll().then(function(result) {
                // All docs are saved
                assert.equal(doc1.isSaved(), true);
                assert.equal(doc1.links[0].isSaved(), true);
                assert.equal(doc1.links[1].isSaved(), true);
                assert.equal(doc1.links[2].isSaved(), true);
                assert.strictEqual(doc1, result);
                
                // All saved docs have an id
                assert.equal(typeof doc1.id, 'string');
                assert.equal(typeof doc1.links[0].id, 'string');
                assert.equal(typeof doc1.links[1].id, 'string');
                assert.equal(typeof doc1.links[2].id, 'string');
                util.sortById(doc1.links);

                doc2.saveAll().then(function(result) {
                    // All docs are saved
                    assert.equal(doc2.isSaved(), true);
                    assert.equal(doc2.links[0].isSaved(), true);
                    assert.equal(doc2.links[1].isSaved(), true);
                    assert.equal(doc2.links[2].isSaved(), true);
                    assert.strictEqual(doc2, result);

                    // All saved docs have an id
                    assert.equal(typeof doc2.id, 'string');
                    assert.equal(typeof doc2.links[0].id, 'string');
                    assert.equal(typeof doc2.links[1].id, 'string');
                    assert.equal(typeof doc2.links[2].id, 'string');
                    util.sortById(doc2.links);

                    util.sortById(doc2.links);

                    // doc1 and doc2 share two common links
                    var map = {}
                    for(var i=0; i<doc1.links.length; i++) {
                        map[doc1.links[i].id] = true
                    }
                    var count = 0;
                    for(var i=0; i<doc2.links.length; i++) {
                        if (map[doc2.links[i].id] != true) {
                            count++;
                        }
                    }
                    assert(count,2);

                    util.sortById(otherDoc1.links2);
                    util.sortById(otherDoc2.links2);
                    util.sortById(otherDoc3.links2);
                    util.sortById(otherDoc4.links2);

                    Model.get(doc1.id).getJoin({links: { _order: "id"}}).run().then(function(result) {
                        assert.equal(result.id, doc1.id);
                        assert.equal(result.links[0].id, doc1.links[0].id);
                        assert.equal(result.links[1].id, doc1.links[1].id);
                        assert.equal(result.links[2].id, doc1.links[2].id);
                        Model.get(doc2.id).getJoin({links: { _order: "id"}}).run().then(function(result) {
                            assert.equal(result.id, doc2.id);
                            assert.equal(result.links[0].id, doc2.links[0].id);
                            assert.equal(result.links[1].id, doc2.links[1].id);
                            assert.equal(result.links[2].id, doc2.links[2].id);
                            OtherModel.get(otherDoc1.id).getJoin().run().then(function(result) {
                                assert.equal(result.id, otherDoc1.id);
                                assert.equal(result.links2[0].id, otherDoc1.links2[0].id)
                                OtherModel.get(otherDoc2.id).getJoin({links2: { _order: "id"}}).run().then(function(result) {
                                    assert.equal(result.id, otherDoc2.id);
                                    assert.equal(result.links2[0].id, otherDoc2.links2[0].id)
                                    assert.equal(result.links2[1].id, otherDoc2.links2[1].id)
                                    OtherModel.get(otherDoc3.id).getJoin({links2: { _order: "id"}}).run().then(function(result) {
                                        assert.equal(result.id, otherDoc3.id);
                                        assert.equal(result.links2[0].id, otherDoc3.links2[0].id)
                                        OtherModel.get(otherDoc4.id).getJoin({links2: { _order: "id"}}).run().then(function(result) {
                                            assert.equal(result.id, otherDoc4.id);
                                            assert.equal(result.links2[0].id, otherDoc4.links2[0].id)
                                            assert.equal(result.links2[1].id, otherDoc4.links2[1].id)
                                            done();
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            }).error(done);
        });
    });
    describe('deleteAll', function(){
        it('hasOne - belongsTo -- no arg', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String,
                otherId: String
            });

            Model.hasOne(OtherModel, "has", "id", "otherId");
            OtherModel.belongsTo(Model, "belongsTo", "otherId", "id");

            var values = {};
            var otherValues = {};
            var doc = new Model(values);
            var otherDoc = new OtherModel(otherValues);

            doc.has = otherDoc;
            otherDoc.belongsTo = doc;

            doc.saveAll().then(function(result) {
                assert.equal(typeof result.id, 'string')
                assert.equal(typeof result.has.id, 'string')
                assert.equal(result.id, result.has.otherId)

                assert.strictEqual(result, doc);
                assert.strictEqual(result.has, doc.has);
                assert.strictEqual(doc.has, otherDoc);

                doc.deleteAll().then(function(result) {

                    Model.get(doc.id).run().error(function(error) {
                        assert(error.message.match(/^Cannot build a new instance of/))
                        OtherModel.get(otherDoc.id).run().error(function(error) {
                            assert(error.message.match(/^Cannot build a new instance of/))
                            done()
                        });
                    });
                });
            }).error(done);
        });
        it('hasOne - belongsTo -- with modelToDelete', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String,
                otherId: String
            });

            Model.hasOne(OtherModel, "has", "id", "otherId");
            OtherModel.belongsTo(Model, "belongsTo", "otherId", "id");

            var values = {};
            var otherValues = {};
            var doc = new Model(values);
            var otherDoc = new OtherModel(otherValues);

            doc.has = otherDoc;
            otherDoc.belongsTo = doc;

            doc.saveAll().then(function(result) {
                assert.equal(typeof result.id, 'string')
                assert.equal(typeof result.has.id, 'string')
                assert.equal(result.id, result.has.otherId)

                assert.strictEqual(result, doc);
                assert.strictEqual(result.has, doc.has);
                assert.strictEqual(doc.has, otherDoc);

                doc.deleteAll({has: true}).then(function(result) {
                    Model.get(doc.id).run().error(function(error) {
                        assert(error.message.match(/^Cannot build a new instance of/))
                        OtherModel.get(otherDoc.id).run().error(function(error) {
                            assert(error.message.match(/^Cannot build a new instance of/))
                            done()
                        });
                    });
                });
            }).error(done);
        });
        it('hasOne - belongsTo -- with empty modelToDelete', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String,
                otherId: String
            });

            Model.hasOne(OtherModel, "has", "id", "otherId");
            OtherModel.belongsTo(Model, "belongsTo", "otherId", "id");

            var values = {};
            var otherValues = {};
            var doc = new Model(values);
            var otherDoc = new OtherModel(otherValues);

            doc.has = otherDoc;
            otherDoc.belongsTo = doc;

            doc.saveAll().then(function(result) {
                assert.equal(typeof result.id, 'string')
                assert.equal(typeof result.has.id, 'string')
                assert.equal(result.id, result.has.otherId)

                assert.strictEqual(result, doc);
                assert.strictEqual(result.has, doc.has);
                assert.strictEqual(doc.has, otherDoc);

                doc.deleteAll({}).then(function(result) {
                    Model.get(doc.id).run().error(function(error) {
                        assert(error.message.match(/^Cannot build a new instance of/))
                        OtherModel.get(otherDoc.id).run().then(function(result) {
                            assert.equal(result.id, otherDoc.id);
                            done()
                        });
                    });
                });
            }).error(done);
        });
        it('hasOne - belongsTo -- with non matching modelToDelete', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String,
                otherId: String
            });

            Model.hasOne(OtherModel, "has", "id", "otherId");
            OtherModel.belongsTo(Model, "belongsTo", "otherId", "id");

            var values = {};
            var otherValues = {};
            var doc = new Model(values);
            var otherDoc = new OtherModel(otherValues);

            doc.has = otherDoc;
            otherDoc.belongsTo = doc;

            doc.saveAll().then(function(result) {
                assert.equal(typeof result.id, 'string')
                assert.equal(typeof result.has.id, 'string')
                assert.equal(result.id, result.has.otherId)

                assert.strictEqual(result, doc);
                assert.strictEqual(result.has, doc.has);
                assert.strictEqual(doc.has, otherDoc);

                doc.deleteAll({foo: {bar: true}}).then(function(result) {
                    Model.get(doc.id).run().error(function(error) {
                        assert(error.message.match(/^Cannot build a new instance of/))
                        OtherModel.get(otherDoc.id).run().then(function(result) {
                            assert.equal(result.id, otherDoc.id);
                            done()
                        });
                    });
                });
            }).error(done);
        });
        it('belongsTo - hasOne -- with no arg', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String,
                otherId: String
            });

            Model.hasOne(OtherModel, "has", "id", "otherId");
            OtherModel.belongsTo(Model, "belongsTo", "otherId", "id");

            var values = {};
            var otherValues = {};
            var doc = new Model(values);
            var otherDoc = new OtherModel(otherValues);

            otherDoc.belongsTo = doc;
            doc.has = otherDoc;

            otherDoc.saveAll().then(function(result) {
                assert.equal(typeof result.id, 'string')
                assert.equal(typeof result.belongsTo.id, 'string')
                assert.equal(result.otherId, result.belongsTo.id)

                assert.strictEqual(result, otherDoc);
                assert.strictEqual(result.belongsTo, otherDoc.belongsTo);
                assert.strictEqual(otherDoc.belongsTo, doc);

                otherDoc.deleteAll().then(function(result) {
                    Model.get(doc.id).run().error(function(error) {
                        assert(error.message.match(/^Cannot build a new instance of/))
                        OtherModel.get(otherDoc.id).run().error(function(error) {
                            assert(error.message.match(/^Cannot build a new instance of/))
                            done()
                        });
                    });
                });
            }).error(done);
        });
        it('belongsTo - hasOne -- with modelToDelete', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String,
                otherId: String
            });

            Model.hasOne(OtherModel, "has", "id", "otherId");
            OtherModel.belongsTo(Model, "belongsTo", "otherId", "id");

            var values = {};
            var otherValues = {};
            var doc = new Model(values);
            var otherDoc = new OtherModel(otherValues);

            otherDoc.belongsTo = doc;
            doc.has = otherDoc;

            otherDoc.saveAll().then(function(result) {
                assert.equal(typeof result.id, 'string')
                assert.equal(typeof result.belongsTo.id, 'string')
                assert.equal(result.otherId, result.belongsTo.id)

                assert.strictEqual(result, otherDoc);
                assert.strictEqual(result.belongsTo, otherDoc.belongsTo);
                assert.strictEqual(otherDoc.belongsTo, doc);

                otherDoc.deleteAll({belongsTo: true}).then(function(result) {
                    Model.get(doc.id).run().error(function(error) {
                        assert(error.message.match(/^Cannot build a new instance of/))
                        OtherModel.get(otherDoc.id).run().error(function(error) {
                            assert(error.message.match(/^Cannot build a new instance of/))
                            done()
                        });
                    });
                });
            }).error(done);
        });
        it('belongsTo - hasOne -- with empty modelToDelete', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String,
                otherId: String
            });

            Model.hasOne(OtherModel, "has", "id", "otherId");
            OtherModel.belongsTo(Model, "belongsTo", "otherId", "id");

            var values = {};
            var otherValues = {};
            var doc = new Model(values);
            var otherDoc = new OtherModel(otherValues);

            otherDoc.belongsTo = doc;
            doc.has = otherDoc;

            otherDoc.saveAll().then(function(result) {
                assert.equal(typeof result.id, 'string')
                assert.equal(typeof result.belongsTo.id, 'string')
                assert.equal(result.otherId, result.belongsTo.id)

                assert.strictEqual(result, otherDoc);
                assert.strictEqual(result.belongsTo, otherDoc.belongsTo);
                assert.strictEqual(otherDoc.belongsTo, doc);

                otherDoc.deleteAll({}).then(function(result) {
                    Model.get(doc.id).run().then(function(result) {
                        assert.equal(result.id, doc.id);
                        OtherModel.get(otherDoc.id).run().error(function(error) {
                            assert(error.message.match(/^Cannot build a new instance of/))
                            done()
                        });
                    });
                });
            }).error(done);
        });

        it('hasMany - belongsTo', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String,
                otherId: String
            });

            Model.hasMany(OtherModel, "has", "id", "otherId");
            OtherModel.belongsTo(Model, "belongsTo", "otherId", "id");

            var values = {};
            var otherValues = {};
            var doc = new Model(values);
            var otherDocs = [new OtherModel(otherValues), new OtherModel(otherValues), new OtherModel(otherValues)];

            doc.has = otherDocs;
            otherDocs[0].belongsTo = doc;
            otherDocs[1].belongsTo = doc;
            otherDocs[2].belongsTo = doc;

            doc.saveAll().then(function(result) {
                assert.equal(typeof result.id, 'string');
                assert.equal(result.has.length, 3);
                for(var i=0; i<result.has.length; i++) {
                    assert.equal(otherDocs[i].isSaved(), true);
                    assert.equal(typeof result.has[i].id, 'string');
                    assert.equal(result.has[i].otherId, result.id);
                }

                assert.strictEqual(result, doc);
                for(var i=0; i<result.has.length; i++) {
                    assert.strictEqual(result.has[i], doc.has[i]);
                }
                assert.strictEqual(doc.has, otherDocs);

                util.sortById(otherDocs);
                doc.deleteAll().then(function(result) {
                    assert.equal(otherDocs[0].isSaved(), false);
                    assert.equal(otherDocs[1].isSaved(), false);
                    assert.equal(otherDocs[2].isSaved(), false);

                    assert.equal(doc.isSaved(), false);

                    Model.get(doc.id).run().error(function(error) {
                        assert(error.message.match(/^Cannot build a new instance of/))
                        OtherModel.getAll(doc.id, {index: "otherId"}).run().then(function(result) {
                            assert.equal(result.length, 0);
                            done()
                        });
                    });
                });
            }).error(done);
        });
        it('hasMany - belongsTo -- empty modelToDelete', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String,
                otherId: String
            });

            Model.hasMany(OtherModel, "has", "id", "otherId");
            OtherModel.belongsTo(Model, "belongsTo", "otherId", "id");

            var values = {};
            var otherValues = {};
            var doc = new Model(values);
            var otherDocs = [new OtherModel(otherValues), new OtherModel(otherValues), new OtherModel(otherValues)];

            doc.has = otherDocs;
            otherDocs[0].belongsTo = doc;
            otherDocs[1].belongsTo = doc;
            otherDocs[2].belongsTo = doc;

            doc.saveAll().then(function(result) {
                assert.equal(typeof result.id, 'string');
                assert.equal(result.has.length, 3);
                for(var i=0; i<result.has.length; i++) {
                    assert.equal(typeof result.has[i].id, 'string')
                    assert.equal(result.has[i].otherId, result.id)
                }

                assert.strictEqual(result, doc);
                for(var i=0; i<result.has.length; i++) {
                    assert.strictEqual(result.has[i], doc.has[i]);
                }
                assert.strictEqual(doc.has, otherDocs);

                util.sortById(otherDocs);

                doc.deleteAll({}).then(function(result) {
                    Model.get(doc.id).run().error(function(error) {
                        assert(error.message.match(/^Cannot build a new instance of/))
                        OtherModel.getAll(otherDocs[0].id, otherDocs[1].id, otherDocs[2].id, {index: "id"}).run().then(function(result) {
                            assert.equal(result.length, 3);
                            OtherModel.getAll(doc.id, {index: "otherId"}).run().then(function(result) {
                                assert.equal(result.length, 0);
                                done()
                            });
                        });
                    });
                });

            }).error(done);
        });
        it('hasMany - belongsTo -- good modelToDelete', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String,
                otherId: String
            });

            Model.hasMany(OtherModel, "has", "id", "otherId");
            OtherModel.belongsTo(Model, "belongsTo", "otherId", "id");

            var values = {};
            var otherValues = {};
            var doc = new Model(values);
            var otherDocs = [new OtherModel(otherValues), new OtherModel(otherValues), new OtherModel(otherValues)];

            doc.has = otherDocs;
            otherDocs[0].belongsTo = doc;
            otherDocs[1].belongsTo = doc;
            otherDocs[2].belongsTo = doc;

            doc.saveAll().then(function(result) {
                assert.equal(typeof result.id, 'string');
                assert.equal(result.has.length, 3);
                for(var i=0; i<result.has.length; i++) {
                    assert.equal(typeof result.has[i].id, 'string')
                    assert.equal(result.has[i].otherId, result.id)
                }

                assert.strictEqual(result, doc);
                for(var i=0; i<result.has.length; i++) {
                    assert.strictEqual(result.has[i], doc.has[i]);
                }
                assert.strictEqual(doc.has, otherDocs);

                util.sortById(otherDocs);

                doc.deleteAll({has: true}).then(function(result) {
                    Model.get(doc.id).run().error(function(error) {
                        assert(error.message.match(/^Cannot build a new instance of/))
                        OtherModel.getAll(otherDocs[0].id, otherDocs[1].id, otherDocs[2].id, {index: "id"}).run().then(function(result) {
                            assert.equal(result.length, 0);
                            OtherModel.getAll(doc.id, {index: "otherId"}).run().then(function(result) {
                                assert.equal(result.length, 0);
                                done()
                            });
                        });


                    });
                });

            }).error(done);
        });
        it('hasMany - belongsTo -- non matching modelToDelete', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String,
                otherId: String
            });

            Model.hasMany(OtherModel, "has", "id", "otherId");
            OtherModel.belongsTo(Model, "belongsTo", "otherId", "id");

            var values = {};
            var otherValues = {};
            var doc = new Model(values);
            var otherDocs = [new OtherModel(otherValues), new OtherModel(otherValues), new OtherModel(otherValues)];

            doc.has = otherDocs;
            otherDocs[0].belongsTo = doc;
            otherDocs[1].belongsTo = doc;
            otherDocs[2].belongsTo = doc;

            doc.saveAll().then(function(result) {
                assert.equal(typeof result.id, 'string');
                assert.equal(result.has.length, 3);
                for(var i=0; i<result.has.length; i++) {
                    assert.equal(typeof result.has[i].id, 'string')
                    assert.equal(result.has[i].otherId, result.id)
                }

                assert.strictEqual(result, doc);
                for(var i=0; i<result.has.length; i++) {
                    assert.strictEqual(result.has[i], doc.has[i]);
                }
                assert.strictEqual(doc.has, otherDocs);

                util.sortById(otherDocs);

                doc.deleteAll({foo: true}).then(function(result) {
                    Model.get(doc.id).run().error(function(error) {
                        assert(error.message.match(/^Cannot build a new instance of/))
                        OtherModel.getAll(otherDocs[0].id, otherDocs[1].id, otherDocs[2].id, {index: "id"}).run().then(function(result) {
                            assert.equal(result.length, 3);
                            OtherModel.getAll(doc.id, {index: "otherId"}).run().then(function(result) {
                                assert.equal(result.length, 0);
                                done()
                            });
                        });

                    });
                });

            }).error(done);
        });
        it('belongsTo - hasMany -- circular references', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String,
                otherId: String
            });

            Model.hasMany(OtherModel, "has", "id", "otherId");
            OtherModel.belongsTo(Model, "belongsTo", "otherId", "id");

            var values = {};
            var otherValues = {};
            var doc = new Model(values);
            var otherDoc1 = new OtherModel(values);
            var otherDoc2 = new OtherModel(values);
            var otherDoc3 = new OtherModel(values);
            var otherDocs = [otherDoc1, otherDoc2, otherDoc3];

            doc.has = otherDocs;
            otherDoc1.belongsTo = doc;
            otherDoc2.belongsTo = doc;
            otherDoc3.belongsTo = doc;

            doc.saveAll().then(function(result) {
                otherDoc1.deleteAll().then(function(result) {
                    assert.equal(otherDocs.length, 2);
                    assert.equal(otherDoc1.isSaved(), false);
                    assert.equal(doc.isSaved(), false);
                    assert.equal(otherDoc2.isSaved(), true);
                    assert.equal(otherDoc3.isSaved(), true);
                    OtherModel.count().execute().then(function(result) {
                        assert.equal(result, 2);
                        done();
                    });
                });
            }).error(done);
        });
        it('belongsTo - hasMany -- must manually overwrite', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String,
                otherId: String
            });

            Model.hasMany(OtherModel, "has", "id", "otherId");
            OtherModel.belongsTo(Model, "belongsTo", "otherId", "id");

            var values = {};
            var otherValues = {};
            var doc = new Model(values);
            var otherDoc0 = new OtherModel(otherValues);
            var otherDoc1 = new OtherModel(otherValues);
            var otherDoc2 = new OtherModel(otherValues);
            var otherDocs = [otherDoc0, otherDoc1, otherDoc2];

            doc.has = otherDocs;
            otherDoc0.belongsTo = doc;
            otherDoc1.belongsTo = doc;
            otherDoc2.belongsTo = doc;

            doc.saveAll().then(function(result) {
                otherDoc0.deleteAll({belongsTo: {has: true}}).then(function(result) {
                    assert.equal(otherDoc0.isSaved(), false);
                    assert.equal(doc.isSaved(), false);
                    assert.equal(otherDoc1.isSaved(), false);
                    assert.equal(otherDoc2.isSaved(), false);
                    OtherModel.count().execute().then(function(result) {
                        assert.equal(result, 0);
                        done();
                    });
                });
            }).error(done);
        });
        it('hasAndBelongsToMany -- primary keys -- does not delete back the same type', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String
            });

            Model.hasAndBelongsToMany(OtherModel, "links", "id", "id");
            OtherModel.hasAndBelongsToMany(Model, "links", "id", "id");

            var values = {};
            var otherValues = {};
            var doc1 = new Model({});
            var doc2 = new Model({});
            var otherDoc1 = new OtherModel({});
            var otherDoc2 = new OtherModel({});
            var otherDoc3 = new OtherModel({});
            var otherDoc4 = new OtherModel({});

            doc1.links = [otherDoc1, otherDoc2, otherDoc4]
            doc2.links = [otherDoc2, otherDoc3, otherDoc4]

            doc1.saveAll().then(function(result) {
                util.sortById(doc1.links);
                doc2.saveAll().then(function(result) {
                    util.sortById(doc2.links);
                    doc1.deleteAll().then(function(result) {
                        assert.equal(doc1.isSaved(), false)
                        assert.equal(doc2.isSaved(), true)
                        assert.equal(otherDoc1.isSaved(), false);
                        assert.equal(otherDoc2.isSaved(), false);
                        assert.equal(otherDoc4.isSaved(), false);
                        assert.equal(otherDoc3.isSaved(), true);
                        done();
                    });
                });
            }).error(done);
        });
        it('hasAndBelongsToMany -- primary keys -- breaking through deletedModel - 1', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String
            });

            Model.hasAndBelongsToMany(OtherModel, "links", "id", "id");
            OtherModel.hasAndBelongsToMany(Model, "links2", "id", "id");

            var values = {};
            var otherValues = {};
            var doc1 = new Model({});
            var doc2 = new Model({});
            var otherDoc1 = new OtherModel({});
            var otherDoc2 = new OtherModel({});
            var otherDoc3 = new OtherModel({});
            var otherDoc4 = new OtherModel({});

            doc1.links = [otherDoc1, otherDoc2, otherDoc4]
            doc2.links = [otherDoc2, otherDoc3, otherDoc4]

            otherDoc1.links2 = [doc1];
            otherDoc2.links2 = [doc1, doc2];
            otherDoc3.links2 = [doc2];
            otherDoc4.links2 = [doc1, doc2];

            doc1.saveAll().then(function(result) {
                util.sortById(doc1.links);
                doc2.saveAll().then(function(result) {
                    util.sortById(doc2.links);

                    doc1.deleteAll({links: {links2: true}}).then(function(result) {
                        assert.equal(doc1.isSaved(), false)
                        assert.equal(otherDoc1.isSaved(), false);
                        assert.equal(otherDoc2.isSaved(), false);
                        assert.equal(otherDoc4.isSaved(), false);
                        assert.equal(otherDoc3.isSaved(), true);

                        assert.equal(doc2.isSaved(), false)
                        done();
                    });
                });
            }).error(done);
        });
        it('hasAndBelongsToMany -- primary keys -- breaking through deletedModel - 2', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String
            });

            Model.hasAndBelongsToMany(OtherModel, "links", "id", "id");
            OtherModel.hasAndBelongsToMany(Model, "links2", "id", "id");

            var values = {};
            var otherValues = {};
            var doc1 = new Model({});
            var doc2 = new Model({});
            var otherDoc1 = new OtherModel({});
            var otherDoc2 = new OtherModel({});
            var otherDoc3 = new OtherModel({});
            var otherDoc4 = new OtherModel({});

            doc1.links = [otherDoc1, otherDoc2, otherDoc4]
            doc2.links = [otherDoc2, otherDoc3, otherDoc4]

            otherDoc1.links2 = [doc1];
            otherDoc2.links2 = [doc1, doc2];
            otherDoc3.links2 = [doc2];
            otherDoc4.links2 = [doc1, doc2];

            doc1.saveAll().then(function(result) {
                util.sortById(doc1.links);
                doc2.saveAll().then(function(result) {
                    util.sortById(doc2.links);

                    otherDoc4.deleteAll({links2: {links: true}}).then(function(result) {
                        assert.equal(doc1.isSaved(), false)
                        assert.equal(doc2.isSaved(), false)
                        assert.deepEqual([
                            otherDoc1.isSaved(),
                            otherDoc2.isSaved(),
                            otherDoc3.isSaved(),
                            otherDoc4.isSaved()
                        ], [false, false, false, false])

                        done();
                    });
                });
            }).error(done);
        });

        it('hasAndBelongsToMany -- not primary keys', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String,
                field1: Number
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String,
                field2: Number
            });

            Model.hasAndBelongsToMany(OtherModel, "links", "field1", "field2");
            OtherModel.hasAndBelongsToMany(Model, "links2", "field2", "field1:");

            var doc1 = new Model({field1: 1});
            var doc2 = new Model({field1: 2});
            var otherDoc1 = new OtherModel({field2: 2});
            var otherDoc2 = new OtherModel({field2: 1});
            var otherDoc3 = new OtherModel({field2: 1});
            var otherDoc4 = new OtherModel({field2: 2});

            doc1.links = [otherDoc2, otherDoc3]
            doc2.links = [otherDoc1, otherDoc4]

            otherDoc1.links2 = [doc2];
            otherDoc2.links2 = [doc1];
            otherDoc3.links2 = [doc1];
            otherDoc4.links2 = [doc2];

            doc1.saveAll().then(function(result) {
                util.sortById(doc1.links);
                doc2.saveAll().then(function(result) {
                    util.sortById(doc2.links);

                    otherDoc4.deleteAll({links2: {links: true}}).then(function(result) {
                        assert.equal(doc1.isSaved(), true)
                        assert.equal(doc2.isSaved(), false)
                        assert.deepEqual([
                            otherDoc1.isSaved(),
                            otherDoc2.isSaved(),
                            otherDoc3.isSaved(),
                            otherDoc4.isSaved()
                        ], [false, true, true, false])

                        done();
                    });
                });
            }).error(done);
        });
        it('hasAndBelongsToMany -- not primary keys -- doing what should never be done - 1', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String,
                field1: Number
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String,
                field2: Number
            });

            Model.hasAndBelongsToMany(OtherModel, "links", "field1", "field2");
            OtherModel.hasAndBelongsToMany(Model, "links2", "field2", "field1:");

            var doc1 = new Model({field1: 1});
            var doc2 = new Model({field1: 2});
            var otherDoc1 = new OtherModel({field2: 2});
            var otherDoc2 = new OtherModel({field2: 1});
            var otherDoc3 = new OtherModel({field2: 1});
            var otherDoc4 = new OtherModel({field2: 2});

            doc1.links = [otherDoc2, otherDoc3]
            doc2.links = [otherDoc1, otherDoc3]

            otherDoc1.links2 = [doc2];
            otherDoc2.links2 = [doc1];
            otherDoc3.links2 = [doc1];
            otherDoc4.links2 = [doc2];

            doc1.saveAll().then(function(result) {
                doc2.saveAll().then(function(result) {
                    otherDoc4.saveAll().then(function(result) {
                        util.sortById(doc1.links);
                        util.sortById(doc2.links);

                        otherDoc4.deleteAll({links2: true}).then(function(result) {
                            assert.equal(doc1.isSaved(), true)
                            assert.equal(doc2.isSaved(), false)
                            assert.deepEqual([
                                otherDoc1.isSaved(),
                                otherDoc2.isSaved(),
                                otherDoc3.isSaved(),
                                otherDoc4.isSaved()
                            ], [true, true, true, false])

                            done();
                        });
                    });
                });
            }).error(done);
        });
        it('hasAndBelongsToMany -- not primary keys -- doing what should never be done - 2', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String,
                field1: Number
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String,
                field2: Number
            });

            Model.hasAndBelongsToMany(OtherModel, "links", "field1", "field2");
            OtherModel.hasAndBelongsToMany(Model, "links2", "field2", "field1:");

            var doc1 = new Model({field1: 1});
            var doc2 = new Model({field1: 2});
            var otherDoc1 = new OtherModel({field2: 2});
            var otherDoc2 = new OtherModel({field2: 1});
            var otherDoc3 = new OtherModel({field2: 1});
            var otherDoc4 = new OtherModel({field2: 2});

            doc1.links = [otherDoc2, otherDoc3]
            doc2.links = [otherDoc1, otherDoc3]

            otherDoc1.links2 = [doc2];
            otherDoc2.links2 = [doc1];
            otherDoc3.links2 = [doc1];
            otherDoc4.links2 = [doc2];

            doc1.saveAll().then(function(result) {
                doc2.saveAll().then(function(result) {
                    otherDoc4.saveAll().then(function(result) {

                        util.sortById(doc1.links);
                        util.sortById(doc2.links);

                        otherDoc4.deleteAll({links2: {links: true}}).then(function(result) {
                            assert.equal(doc1.isSaved(), true)
                            assert.equal(doc2.isSaved(), false)
                            assert.deepEqual([
                                otherDoc1.isSaved(),
                                otherDoc2.isSaved(),
                                otherDoc3.isSaved(),
                                otherDoc4.isSaved()
                            ], [false, true, false, false])

                            done();
                        });
                    });
                });
            }).error(done);
        });
        it('hasAndBelongsToMany -- not primary keys -- doing what should never be done - 3', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String,
                field1: Number
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String,
                field2: Number
            });

            Model.hasAndBelongsToMany(OtherModel, "links", "field1", "field2");
            OtherModel.hasAndBelongsToMany(Model, "links2", "field2", "field1:");

            var doc1 = new Model({field1: 1});
            var doc2 = new Model({field1: 2});
            var otherDoc1 = new OtherModel({field2: 2});
            var otherDoc2 = new OtherModel({field2: 1});
            var otherDoc3 = new OtherModel({field2: 1});
            var otherDoc4 = new OtherModel({field2: 2});

            doc1.links = [otherDoc2, otherDoc3]
            doc2.links = [otherDoc1, otherDoc3]

            otherDoc1.links2 = [doc2];
            otherDoc2.links2 = [doc1];
            otherDoc3.links2 = [doc1];
            otherDoc4.links2 = [doc2];

            doc1.saveAll().then(function(result) {
                doc2.saveAll().then(function(result) {
                    otherDoc4.saveAll().then(function(result) {
                        util.sortById(doc1.links);
                        util.sortById(doc2.links);

                        otherDoc4.deleteAll({links2: {links: {links2: true}}}).then(function(result) {
                            assert.equal(doc1.isSaved(), false)
                            assert.equal(doc2.isSaved(), false)
                            assert.deepEqual([
                                otherDoc1.isSaved(),
                                otherDoc2.isSaved(),
                                otherDoc3.isSaved(),
                                otherDoc4.isSaved()
                            ], [false, true, false, false])

                            done();
                        });
                    });
                });
            }).error(done);
        });
        it('hasAndBelongsToMany -- not primary keys -- doing what should never be done - 4', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String,
                field1: Number
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String,
                field2: Number
            });

            Model.hasAndBelongsToMany(OtherModel, "links", "field1", "field2");
            OtherModel.hasAndBelongsToMany(Model, "links2", "field2", "field1");

            var doc1 = new Model({field1: 1});
            var doc2 = new Model({field1: 2});
            var otherDoc1 = new OtherModel({field2: 2});
            var otherDoc2 = new OtherModel({field2: 1});
            var otherDoc3 = new OtherModel({field2: 1});
            var otherDoc4 = new OtherModel({field2: 2});

            doc1.links = [otherDoc2, otherDoc3]
            doc2.links = [otherDoc1, otherDoc3]

            otherDoc1.links2 = [doc2];
            otherDoc2.links2 = [doc1];
            otherDoc3.links2 = [doc1];
            otherDoc4.links2 = [doc2];

            doc1.saveAll().then(function(result) {
                util.sortById(doc1.links);
                doc2.saveAll().then(function(result) {
                    util.sortById(doc2.links);
                    otherDoc4.saveAll().then(function(result) {
                        //
                        // otherdoc4 -> doc2 -> otherdoc1 -> doc2 -> otherdoc1
                        //                                        -> otherdoc3
                        //                   -> otherdoc3 -> doc1 -> otherdoc2
                        //                                        -> otherdoc3
                        //
                        // NOTE: We explicitly force twice the deletion of doc2...
                        //
                        otherDoc4.deleteAll({links2: {links: {links2: {links: true}}}}).then(function(result) {
                            assert.equal(doc1.isSaved(), false)
                            assert.equal(doc2.isSaved(), false)
                            assert.deepEqual([
                                otherDoc1.isSaved(),
                                otherDoc2.isSaved(),
                                otherDoc3.isSaved(),
                                otherDoc4.isSaved()
                            ], [false, false, false, false])

                            done();
                        });
                    });
                });
            }).error(done);
        });
    });
    describe('getJoin', function(){
        it('hasOne - belongsTo', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String,
                otherId: String
            });

            Model.hasOne(OtherModel, "has", "id", "otherId");
            OtherModel.belongsTo(Model, "belongsTo", "otherId", "id");

            var values = {};
            var otherValues = {};
            var doc = new Model(values);
            var otherDoc = new OtherModel(otherValues);

            doc.has = otherDoc;
            otherDoc.belongsTo = doc;

            doc.saveAll().then(function(result) {
                Model.get(doc.id).getJoin().run().then(function(result) {
                    assert.equal(result.id, doc.id);
                    assert.equal(result.has.id, doc.has.id);
                    assert.equal(result.has.otherId, doc.has.otherId);
                    OtherModel.get(otherDoc.id).getJoin().run().then(function(result) {
                        assert.equal(result.id, doc.has.id);
                        assert.equal(result.otherId, doc.has.otherId);
                        assert.equal(result.belongsTo.id, doc.id);
                        done()
                    });
                });

            }).error(done);
        });
        it('hasOne - belongsTo - non matching modelToGet', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String,
                otherId: String
            });

            Model.hasOne(OtherModel, "has", "id", "otherId");
            OtherModel.belongsTo(Model, "belongsTo", "otherId", "id");

            var values = {};
            var otherValues = {};
            var doc = new Model(values);
            var otherDoc = new OtherModel(otherValues);

            doc.has = otherDoc;
            otherDoc.belongsTo = doc;

            doc.saveAll().then(function(result) {
                Model.get(doc.id).getJoin({foo: true}).run().then(function(result) {
                    assert.equal(result.id, doc.id);
                    assert.equal(result.has, undefined);
                    OtherModel.get(otherDoc.id).getJoin({foo: true}).run().then(function(result) {
                        assert.equal(result.id, doc.has.id);
                        assert.equal(result.otherId, doc.has.otherId);
                        assert.equal(result.belongsTo, undefined);
                        done()
                    });
                });

            }).error(done);
        });
        it('hasOne - belongsTo - matching modelToGet', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String,
                otherId: String
            });

            Model.hasOne(OtherModel, "has", "id", "otherId");
            OtherModel.belongsTo(Model, "belongsTo", "otherId", "id");

            var values = {};
            var otherValues = {};
            var doc = new Model(values);
            var otherDoc = new OtherModel(otherValues);

            doc.has = otherDoc;
            otherDoc.belongsTo = doc;

            doc.saveAll().then(function(result) {
                Model.get(doc.id).getJoin({has: true}).run().then(function(result) {
                    assert.equal(result.id, doc.id);
                    assert.equal(result.has.id, doc.has.id);
                    assert.equal(result.has.otherId, doc.has.otherId);
                    OtherModel.get(otherDoc.id).getJoin({belongsTo: true}).run().then(function(result) {
                        assert.equal(result.id, doc.has.id);
                        assert.equal(result.otherId, doc.has.otherId);
                        assert.equal(result.belongsTo.id, doc.id);
                        done()
                    });
                });
            }).error(done);
        });
        it('hasMany - belongsTo -- matching modelToGet', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String,
                otherId: String
            });

            Model.hasMany(OtherModel, "has", "id", "otherId");
            OtherModel.belongsTo(Model, "belongsTo", "otherId", "id");

            var values = {};
            var otherValues = {};
            var doc = new Model(values);
            var otherDocs = [new OtherModel(otherValues), new OtherModel(otherValues), new OtherModel(otherValues)];

            doc.has = otherDocs;
            otherDocs[0].belongsTo = doc;
            otherDocs[1].belongsTo = doc;
            otherDocs[2].belongsTo = doc;

            doc.saveAll().then(function(result) {
                Model.get(doc.id).getJoin({has: true}).run().then(function(result) {
                    assert.equal(result.id, doc.id);
                    assert.equal(result.has.length, 3);

                    OtherModel.getAll(doc.id, {index: "otherId"}).getJoin({belongsTo: true}).run().then(function(result) {
                        assert.equal(result.length, 3);
                        for(var i=0; i<result.length; i++) {
                            assert.equal(result[i].belongsTo.id, doc.id)
                        }
                        done()
                    })
                });
            }).error(done);
        });
        it('hasMany - belongsTo -- non matching modelToGet', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String,
                otherId: String
            });

            Model.hasMany(OtherModel, "has", "id", "otherId");
            OtherModel.belongsTo(Model, "belongsTo", "otherId", "id");

            var values = {};
            var otherValues = {};
            var doc = new Model(values);
            var otherDocs = [new OtherModel(otherValues), new OtherModel(otherValues), new OtherModel(otherValues)];

            doc.has = otherDocs;
            otherDocs[0].belongsTo = doc;
            otherDocs[1].belongsTo = doc;
            otherDocs[2].belongsTo = doc;

            doc.saveAll().then(function(result) {
                Model.get(doc.id).getJoin({foo: true}).run().then(function(result) {
                    assert.equal(result.id, doc.id);
                    assert.equal(result.has, undefined);

                    OtherModel.getAll(doc.id, {index: "otherId"}).getJoin({foo: true}).run().then(function(result) {
                        assert.equal(result.length, 3);
                        for(var i=0; i<result.length; i++) {
                            assert.equal(result[i].belongsTo, undefined)
                        }
                        done()
                    })
                });
            }).error(done);
        });
        it('hasMany - belongsTo -- default, fetch everything', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String,
                otherId: String
            });

            Model.hasMany(OtherModel, "has", "id", "otherId");
            OtherModel.belongsTo(Model, "belongsTo", "otherId", "id");

            var values = {};
            var otherValues = {};
            var doc = new Model(values);
            var otherDocs = [new OtherModel(otherValues), new OtherModel(otherValues), new OtherModel(otherValues)];

            doc.has = otherDocs;
            otherDocs[0].belongsTo = doc;
            otherDocs[1].belongsTo = doc;
            otherDocs[2].belongsTo = doc;

            doc.saveAll().then(function(result) {
                Model.get(doc.id).getJoin().run().then(function(result) {
                    assert.equal(result.id, doc.id);
                    assert.equal(result.has.length, 3);

                    OtherModel.getAll(doc.id, {index: "otherId"}).getJoin().run().then(function(result) {
                        assert.equal(result.length, 3);
                        for(var i=0; i<result.length; i++) {
                            assert.equal(result[i].belongsTo.id, doc.id)
                        }

                        done()
                    })
                });
            }).error(done);
        });
        it('hasAndBelongsToMany -- primary keys -- fetch everything by default', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String
            });

            Model.hasAndBelongsToMany(OtherModel, "links", "id", "id");
            OtherModel.hasAndBelongsToMany(Model, "links", "id", "id");

            var values = {};
            var otherValues = {};
            var doc1 = new Model({});
            var doc2 = new Model({});
            var otherDoc1 = new OtherModel({});
            var otherDoc2 = new OtherModel({});
            var otherDoc3 = new OtherModel({});
            var otherDoc4 = new OtherModel({});

            doc1.links = [otherDoc1, otherDoc2, otherDoc4]
            doc2.links = [otherDoc2, otherDoc3, otherDoc4]

            doc1.saveAll().then(function(result) {
                util.sortById(doc1.links);
                doc2.saveAll().then(function(result) {
                    util.sortById(doc2.links);
                    Model.get(doc1.id).getJoin().run().then(function(result) {
                        assert.equal(result.id, doc1.id);
                        assert.equal(result.links.length, doc1.links.length);
                        Model.get(doc2.id).getJoin().run().then(function(result) {
                            assert.equal(result.id, doc2.id);
                            assert.equal(result.links.length, doc2.links.length);
                            done()
                        })
                    });
                });
            }).error(done);
        });
        it('hasAndBelongsToMany -- primary keys -- matching modelToGet', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String
            });

            Model.hasAndBelongsToMany(OtherModel, "links", "id", "id");
            OtherModel.hasAndBelongsToMany(Model, "links", "id", "id");

            var values = {};
            var otherValues = {};
            var doc1 = new Model({});
            var doc2 = new Model({});
            var otherDoc1 = new OtherModel({});
            var otherDoc2 = new OtherModel({});
            var otherDoc3 = new OtherModel({});
            var otherDoc4 = new OtherModel({});

            doc1.links = [otherDoc1, otherDoc2, otherDoc4]
            doc2.links = [otherDoc2, otherDoc3, otherDoc4]

            doc1.saveAll().then(function(result) {
                util.sortById(doc1.links);
                doc2.saveAll().then(function(result) {
                    util.sortById(doc2.links);
                    Model.get(doc1.id).getJoin({links: true}).run().then(function(result) {
                        assert.equal(result.id, doc1.id);
                        assert.equal(result.links.length, doc1.links.length);
                        Model.get(doc2.id).getJoin({links: true}).run().then(function(result) {
                            assert.equal(result.id, doc2.id);
                            assert.equal(result.links.length, doc2.links.length);
                            done()
                        })
                    });
                });
            }).error(done);
        });
        it('hasAndBelongsToMany -- primary keys -- non matching modelToGet', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String
            });

            Model.hasAndBelongsToMany(OtherModel, "links", "id", "id");
            OtherModel.hasAndBelongsToMany(Model, "links", "id", "id");

            var values = {};
            var otherValues = {};
            var doc1 = new Model({});
            var doc2 = new Model({});
            var otherDoc1 = new OtherModel({});
            var otherDoc2 = new OtherModel({});
            var otherDoc3 = new OtherModel({});
            var otherDoc4 = new OtherModel({});

            doc1.links = [otherDoc1, otherDoc2, otherDoc4]
            doc2.links = [otherDoc2, otherDoc3, otherDoc4]

            doc1.saveAll().then(function(result) {
                util.sortById(doc1.links);
                doc2.saveAll().then(function(result) {
                    util.sortById(doc2.links);
                    Model.get(doc1.id).getJoin({links: true}).run().then(function(result) {
                        assert.equal(result.id, doc1.id);
                        assert.equal(result.links.length, doc1.links.length);
                        Model.get(doc2.id).getJoin({links: true}).run().then(function(result) {
                            assert.equal(result.id, doc2.id);
                            assert.equal(result.links.length, doc2.links.length);
                            done()
                        })
                    });
                });
            }).error(done);
        });
        it('hasAndBelongsToMany -- primary keys -- matching modelToGet with options', function(done) {
            var name = util.s8();
            var Model = thinky.createModel(name, {
                id: String
            });

            var otherName = util.s8();
            var OtherModel = thinky.createModel(otherName, {
                id: String
            });

            Model.hasAndBelongsToMany(OtherModel, "links", "id", "id");
            OtherModel.hasAndBelongsToMany(Model, "links", "id", "id");

            var values = {};
            var otherValues = {};
            var doc1 = new Model({});
            var doc2 = new Model({});
            var otherDoc1 = new OtherModel({});
            var otherDoc2 = new OtherModel({});
            var otherDoc3 = new OtherModel({});
            var otherDoc4 = new OtherModel({});

            doc1.links = [otherDoc1, otherDoc2, otherDoc4]
            doc2.links = [otherDoc2, otherDoc3, otherDoc4]

            doc1.saveAll().then(function(result) {
                util.sortById(doc1.links);
                doc2.saveAll().then(function(result) {
                    util.sortById(doc2.links);
                    Model.get(doc1.id).getJoin({links: {_order: "id"}}).run().then(function(result) {
                        assert.equal(result.id, doc1.id);
                        assert.equal(result.links[0].id, doc1.links[0].id);
                        assert.equal(result.links[1].id, doc1.links[1].id);
                        assert.equal(result.links[2].id, doc1.links[2].id);
                        Model.get(doc2.id).getJoin({links: {_order: "id"}}).run().then(function(result) {
                            assert.equal(result.id, doc2.id);
                            assert.equal(result.links[0].id, doc2.links[0].id);
                            assert.equal(result.links[1].id, doc2.links[1].id);
                            assert.equal(result.links[2].id, doc2.links[2].id);

                            done()
                        })
                    });
                });
            }).error(done);
        });
    });
});
describe('Advanced cases', function(){
    it('hasAndBelongsToMany -- pairs', function(done) {
        var name = util.s8();
        var Model = thinky.createModel(name, {
            id: String
        });

        var otherName = util.s8();
        var OtherModel = thinky.createModel(otherName, {
            id: String
        });

        Model.hasAndBelongsToMany(Model, "links", "id", "id");

        var values = {};
        var otherValues = {};
        var doc1 = new Model({});
        var doc2 = new Model({});
        var doc3 = new Model({});
        var doc4 = new Model({});
        var doc5 = new Model({});
        var doc6 = new Model({});

        doc1.links = [doc2, doc3];
        doc2.links = [doc1];
        doc3.links = [doc1, doc2];

        doc1.saveAll({links: true}).then(function(result) {
        doc2.saveAll({links: true}).then(function(result) {
        doc3.saveAll({links: true}).then(function(result) {
            Model.get(doc1.id).getJoin().run().then(function(result) {
                assert.equal(result.links, undefined);
                Model.get(doc1.id).getJoin({links: true}).run().then(function(result) {
                    assert.equal(result.links.length, 2);
                    done();
                });
            });
        });
        });
        }).error(done);
    });

    it('hasAndBelongsToMany -- pairs', function(done) {
        var name = util.s8();
        var Model = thinky.createModel(name, {
            id: String
        });

        Model.hasAndBelongsToMany(Model, "links", "id", "id");

        var values = {};
        var otherValues = {};
        var doc1 = new Model({});
        var doc2 = new Model({});

        doc1.links = [doc2];

        doc1.saveAll({links: true}).then(function(result) {
            return Model.get(doc1.id).getJoin({links: true}).run()
        }).then(function(result) {
            assert.deepEqual(result.links[0], doc2);
            done();
        }).error(done);
    });

    it('hasOne/belongsTo -- pairs', function(done) {
        var Human = thinky.createModel("Human", {id: String, name: String, contactId: String});
        Human.belongsTo(Human, "emergencyContact", "contactId", "id");

        var michel = new Human({
            name: "Michel"
        });
        var sophia = new Human({
            name: "Sophia"
        });

        michel.emergencyContact = sophia;
        michel.saveAll({emergencyContact: true}).then(function(result) {
            assert.strictEqual(michel, result);
            assert.equal(michel.isSaved(), true);
            assert.equal(sophia.isSaved(), true);
            assert.equal(sophia.id, michel.contactId);
            done();
        }).error(done);
    });
});
describe('delete - hidden links behavior', function() {
    it('should work for hasOne - 1', function(done) {
        var Model = thinky.createModel(util.s8(), {
            id: String
        });
        var OtherModel = thinky.createModel(util.s8(), {
            id: String,
            foreignKey: String
        });

        Model.hasOne(OtherModel, "otherDoc", "id", "foreignKey");
       
        var doc = new Model({});
        var otherDoc = new OtherModel({});
        doc.otherDoc = otherDoc;

        doc.saveAll().then(function() {
            doc.delete().then(function() {
                assert.equal(doc.isSaved(), false);
                assert.equal(otherDoc.isSaved(), true);
                assert.equal(otherDoc.foreignKey, undefined);
                OtherModel.get(otherDoc.id).run().then(function(otherDoc) {
                    assert.equal(otherDoc.isSaved(), true);
                    assert.equal(otherDoc.foreignKey, undefined);
                    done();
                });
            });
        });

    });
    it('should work for hasOne - 2', function(done) {
        var Model = thinky.createModel(util.s8(), {
            id: String
        });
        var OtherModel = thinky.createModel(util.s8(), {
            id: String,
            foreignKey: String
        });

        Model.hasOne(OtherModel, "otherDoc", "id", "foreignKey");
       
        var doc = new Model({});
        var otherDoc = new OtherModel({});
        doc.otherDoc = otherDoc;

        doc.saveAll().then(function() {
            otherDoc.delete().then(function() {
                assert.equal(doc.isSaved(), true);
                assert.equal(otherDoc.isSaved(), false);
                assert.equal(doc.otherDoc, undefined);
                Model.get(doc.id).getJoin().run().then(function(doc) {
                    assert.equal(doc.isSaved(), true);
                    assert.equal(doc.otherDoc, undefined);
                    done();
                });
            });
        });
    });
    it('should work for hasOne - 3', function(done) {
        var Model = thinky.createModel(util.s8(), {
            id: String
        });
        var OtherModel = thinky.createModel(util.s8(), {
            id: String,
            foreignKey: String
        });

        Model.hasOne(OtherModel, "otherDoc", "id", "foreignKey");
       
        var doc = new Model({});
        var otherDoc = new OtherModel({});
        doc.otherDoc = otherDoc;

        doc.saveAll().then(function() {
            Model.get(doc.id).getJoin().run().then(function(doc) {
                var otherDoc = doc.otherDoc;
                doc.delete().then(function() {
                    assert.equal(doc.isSaved(), false);
                    assert.equal(otherDoc.isSaved(), true);
                    assert.equal(otherDoc.foreignKey, undefined);
                    OtherModel.get(otherDoc.id).run().then(function(otherDoc) {
                        assert.equal(otherDoc.isSaved(), true);
                        assert.equal(otherDoc.foreignKey, undefined);
                        done();
                    });
                });
            });
        });

    });
    it('should work for hasOne - 4', function(done) {
        var Model = thinky.createModel(util.s8(), {
            id: String
        });
        var OtherModel = thinky.createModel(util.s8(), {
            id: String,
            foreignKey: String
        });

        Model.hasOne(OtherModel, "otherDoc", "id", "foreignKey");
       
        var doc = new Model({});
        var otherDoc = new OtherModel({});
        doc.otherDoc = otherDoc;

        doc.saveAll().then(function() {
            Model.get(doc.id).getJoin().run().then(function(doc) {
                var otherDoc = doc.otherDoc;
                otherDoc.delete().then(function() {
                    assert.equal(doc.isSaved(), true);
                    assert.equal(otherDoc.isSaved(), false);
                    assert.equal(doc.otherDoc, undefined);
                    Model.get(doc.id).getJoin().run().then(function(doc) {
                        assert.equal(doc.isSaved(), true);
                        assert.equal(doc.otherDoc, undefined);
                        done();
                    });
                });
            });
        });
    });
    it('should work for belongsTo - 1', function(done) {
        var Model = thinky.createModel(util.s8(), {
            id: String,
            foreignKey: String
        });
        var OtherModel = thinky.createModel(util.s8(), {
            id: String
        });

        Model.belongsTo(OtherModel, "otherDoc", "foreignKey", "id");
       
        var doc = new Model({});
        var otherDoc = new OtherModel({});
        doc.otherDoc = otherDoc;

        doc.saveAll().then(function() {
            doc.delete().then(function() {
                assert.equal(doc.isSaved(), false);
                assert.equal(otherDoc.isSaved(), true);
                done();
            });
        });
    });
    it('should work for belongsTo - 2', function(done) {
        var Model = thinky.createModel(util.s8(), {
            id: String,
            foreignKey: String
        });
        var OtherModel = thinky.createModel(util.s8(), {
            id: String
        });

        Model.belongsTo(OtherModel, "otherDoc", "foreignKey", "id");

        var doc = new Model({});
        var otherDoc = new OtherModel({});
        doc.otherDoc = otherDoc;

        doc.saveAll().then(function() {
            otherDoc.delete().then(function() {
                assert.equal(doc.isSaved(), true);
                assert.equal(otherDoc.isSaved(), false);
                assert.equal(doc.otherDoc, undefined);
                assert.equal(doc.foreignKey, undefined);
                Model.get(doc.id).getJoin().run().then(function(doc) {
                    assert.equal(doc.isSaved(), true);
                    assert.equal(doc.otherDoc, undefined);
                    assert.equal(doc.foreignKey, undefined);
                    done();
                });
            });
        });
    });
    it('should work for belongsTo - 3', function(done) {
        var Model = thinky.createModel(util.s8(), {
            id: String,
            foreignKey: String
        });
        var OtherModel = thinky.createModel(util.s8(), {
            id: String
        });

        Model.belongsTo(OtherModel, "otherDoc", "foreignKey", "id");
       
        var doc = new Model({});
        var otherDoc = new OtherModel({});
        doc.otherDoc = otherDoc;

        doc.saveAll().then(function() {
            Model.get(doc.id).getJoin().run().then(function(doc) {
                doc.delete().then(function() {
                    assert.equal(doc.isSaved(), false);
                    assert.equal(doc.otherDoc.isSaved(), true);
                    done();
                });
            });
        });
    });
    it('should work for belongsTo - 4', function(done) {
        var Model = thinky.createModel(util.s8(), {
            id: String,
            foreignKey: String
        });
        var OtherModel = thinky.createModel(util.s8(), {
            id: String
        });

        Model.belongsTo(OtherModel, "otherDoc", "foreignKey", "id");
        
        var doc = new Model({});
        var otherDoc = new OtherModel({});
        doc.otherDoc = otherDoc;

        doc.saveAll().then(function() {
            Model.get(doc.id).getJoin().run().then(function(doc) {
                var otherDoc = doc.otherDoc;
                doc.otherDoc.delete().then(function() {
                    assert.equal(doc.isSaved(), true);
                    assert.equal(otherDoc.isSaved(), false);
                    assert.equal(doc.otherDoc, undefined);
                    assert.equal(doc.foreignKey, undefined);
                    Model.get(doc.id).getJoin().run().then(function(doc) {
                        assert.equal(doc.isSaved(), true);
                        assert.equal(doc.otherDoc, undefined);
                        assert.equal(doc.foreignKey, undefined);
                        done();
                    });
                });
            });
        });
    });
    it('should work for hasMany - 1', function(done) {
        var Model = thinky.createModel(util.s8(), {
            id: String
        });
        var OtherModel = thinky.createModel(util.s8(), {
            id: String,
            foreignKey: String
        });

        Model.hasMany(OtherModel, "otherDocs", "id", "foreignKey");
       
        var doc = new Model({});
        var otherDoc1 = new OtherModel({});
        var otherDoc2 = new OtherModel({});
        var otherDoc3 = new OtherModel({});
        doc.otherDocs = [otherDoc1, otherDoc2, otherDoc3];

        doc.saveAll().then(function() {
            doc.delete().then(function() {
                assert.equal(doc.isSaved(), false);
                assert.equal(otherDoc1.isSaved(), true);
                assert.equal(otherDoc2.isSaved(), true);
                assert.equal(otherDoc3.isSaved(), true);
                assert.equal(otherDoc1.foreignKey, undefined);
                assert.equal(otherDoc2.foreignKey, undefined);
                assert.equal(otherDoc3.foreignKey, undefined);
                OtherModel.get(otherDoc1.id).run().then(function(otherDoc1) {
                    assert.equal(otherDoc1.isSaved(), true);
                    assert.equal(otherDoc1.foreignKey, undefined);
                    done();
                });
            });
        });
    });
    it('should work for hasMany - 2', function(done) {
        var Model = thinky.createModel(util.s8(), {
            id: String
        });
        var OtherModel = thinky.createModel(util.s8(), {
            id: String,
            foreignKey: String
        });

        Model.hasMany(OtherModel, "otherDocs", "id", "foreignKey");
       
        var doc = new Model({});
        var otherDoc1 = new OtherModel({});
        var otherDoc2 = new OtherModel({});
        var otherDoc3 = new OtherModel({});
        doc.otherDocs = [otherDoc1, otherDoc2, otherDoc3];

        doc.saveAll().then(function() {
            otherDoc1.delete().then(function() {
                assert.equal(doc.isSaved(), true);
                assert.equal(otherDoc1.isSaved(), false);
                assert.equal(otherDoc2.isSaved(), true);
                assert.equal(otherDoc3.isSaved(), true);
                assert.notEqual(otherDoc1.foreignKey, undefined);
                // We currently don't clean in this case
                assert.notEqual(otherDoc2.foreignKey, undefined);
                assert.notEqual(otherDoc3.foreignKey, undefined);
                assert.equal(doc.otherDocs.length, 2);
                Model.get(doc.id).getJoin().run().then(function(otherDoc1) {
                    assert.equal(doc.otherDocs.length, 2);
                    done();
                });
            });
        });
    });
    it('should work for hasMany - 3', function(done) {
        var Model = thinky.createModel(util.s8(), {
            id: String
        });
        var OtherModel = thinky.createModel(util.s8(), {
            id: String,
            foreignKey: String
        });

        Model.hasMany(OtherModel, "otherDocs", "id", "foreignKey");
       
        var doc = new Model({});
        var otherDoc1 = new OtherModel({});
        var otherDoc2 = new OtherModel({});
        var otherDoc3 = new OtherModel({});
        doc.otherDocs = [otherDoc1, otherDoc2, otherDoc3];

        doc.saveAll().then(function() {
            Model.get(doc.id).getJoin().run().then(function(doc) {
                var otherDoc1 = doc.otherDocs[0];
                var otherDoc2 = doc.otherDocs[1];
                var otherDoc3 = doc.otherDocs[2];
                doc.delete().then(function() {
                    assert.equal(doc.isSaved(), false);
                    assert.equal(otherDoc1.isSaved(), true);
                    assert.equal(otherDoc2.isSaved(), true);
                    assert.equal(otherDoc3.isSaved(), true);
                    assert.equal(otherDoc1.foreignKey, undefined);
                    assert.equal(otherDoc2.foreignKey, undefined);
                    assert.equal(otherDoc3.foreignKey, undefined);
                    OtherModel.get(otherDoc1.id).run().then(function(otherDoc1) {
                        assert.equal(otherDoc1.isSaved(), true);
                        assert.equal(otherDoc1.foreignKey, undefined);
                        done();
                    });
                });
            });
        });
    });
    it('should work for hasMany - 4', function(done) {
        var Model = thinky.createModel(util.s8(), {
            id: String
        });
        var OtherModel = thinky.createModel(util.s8(), {
            id: String,
            foreignKey: String
        });

        Model.hasMany(OtherModel, "otherDocs", "id", "foreignKey");
       
        var doc = new Model({});
        var otherDoc1 = new OtherModel({});
        var otherDoc2 = new OtherModel({});
        var otherDoc3 = new OtherModel({});
        doc.otherDocs = [otherDoc1, otherDoc2, otherDoc3];

        doc.saveAll().then(function() {
            Model.get(doc.id).getJoin().run().then(function(doc) {
                var otherDoc1 = doc.otherDocs[0];
                var otherDoc2 = doc.otherDocs[1];
                var otherDoc3 = doc.otherDocs[2];
                otherDoc1.delete().then(function() {
                    assert.equal(doc.isSaved(), true);
                    assert.equal(otherDoc1.isSaved(), false);
                    assert.equal(otherDoc2.isSaved(), true);
                    assert.equal(otherDoc3.isSaved(), true);
                    assert.notEqual(otherDoc1.foreignKey, undefined);
                    // We currently don't clean in this case
                    //assert.equal(otherDoc2.foreignKey, undefined);
                    assert.notEqual(otherDoc3.foreignKey, undefined);
                    assert.equal(doc.otherDocs.length, 2);
                    Model.get(doc.id).getJoin().run().then(function(otherDoc1) {
                        assert.equal(doc.otherDocs.length, 2);
                        done();
                    });
                });
            });
        });
    });
    it('should work for hasAndBelongsToMany - 1', function(done) {
        var Model = thinky.createModel(util.s8(), {
            id: String
        });
        var OtherModel = thinky.createModel(util.s8(), {
            id: String
        });

        Model.hasAndBelongsToMany(OtherModel, "otherDocs", "id", "id");
       
        var doc = new Model({});
        var otherDoc1 = new OtherModel({});
        var otherDoc2 = new OtherModel({});
        var otherDoc3 = new OtherModel({});
        doc.otherDocs = [otherDoc1, otherDoc2, otherDoc3];

        doc.saveAll().then(function() {
            doc.delete().then(function() {
                assert.equal(doc.isSaved(), false);
                assert.equal(otherDoc1.isSaved(), true);
                assert.equal(otherDoc2.isSaved(), true);
                assert.equal(otherDoc3.isSaved(), true);
                assert.equal(otherDoc3.isSaved(), true);
                assert.equal(doc.otherDocs.length, 3);
                r.table(Model._getModel()._joins.otherDocs.link).count().run().then(function(result) {
                    assert.equal(result, 0);
                    done();
                });
            });
        });
    });
    it('should work for hasAndBelongsToMany - 2', function(done) {
        var Model = thinky.createModel(util.s8(), {
            id: String
        });
        var OtherModel = thinky.createModel(util.s8(), {
            id: String
        });

        Model.hasAndBelongsToMany(OtherModel, "otherDocs", "id", "id");
       
        var doc = new Model({});
        var otherDoc1 = new OtherModel({});
        var otherDoc2 = new OtherModel({});
        var otherDoc3 = new OtherModel({});
        doc.otherDocs = [otherDoc1, otherDoc2, otherDoc3];

        doc.saveAll().then(function() {
            otherDoc1.delete().then(function() {
                assert.equal(doc.isSaved(), true);
                assert.equal(otherDoc1.isSaved(), false);
                assert.equal(otherDoc2.isSaved(), true);
                assert.equal(otherDoc3.isSaved(), true);
                assert.equal(doc.otherDocs.length, 2);
                Model.get(doc.id).getJoin().run().then(function(otherDoc1) {
                    assert.equal(doc.otherDocs.length, 2);
                    done();
                });
            });
        });
    });
    it('should work for hasAndBelongsToMany - 3', function(done) {
        var Model = thinky.createModel(util.s8(), {
            id: String
        });
        var OtherModel = thinky.createModel(util.s8(), {
            id: String
        });

        Model.hasAndBelongsToMany(OtherModel, "otherDocs", "id", "id");
       
        var doc = new Model({});
        var otherDoc1 = new OtherModel({});
        var otherDoc2 = new OtherModel({});
        var otherDoc3 = new OtherModel({});
        doc.otherDocs = [otherDoc1, otherDoc2, otherDoc3];

        doc.saveAll().then(function() {
            Model.get(doc.id).getJoin().run().then(function(doc) {
                doc.delete().then(function() {
                    assert.equal(doc.isSaved(), false);
                    assert.equal(otherDoc1.isSaved(), true);
                    assert.equal(otherDoc2.isSaved(), true);
                    assert.equal(otherDoc3.isSaved(), true);
                    assert.equal(otherDoc3.isSaved(), true);
                    assert.equal(doc.otherDocs.length, 3);
                    r.table(Model._getModel()._joins.otherDocs.link).count().run().then(function(result) {
                        assert.equal(result, 0);
                        done();
                    });
                });
            });
        });
    });
    it('should work for hasAndBelongsToMany - 4', function(done) {
        var Model = thinky.createModel(util.s8(), {
            id: String
        });
        var OtherModel = thinky.createModel(util.s8(), {
            id: String
        });

        Model.hasAndBelongsToMany(OtherModel, "otherDocs", "id", "id");
       
        var doc = new Model({});
        var otherDoc1 = new OtherModel({});
        var otherDoc2 = new OtherModel({});
        var otherDoc3 = new OtherModel({});
        doc.otherDocs = [otherDoc1, otherDoc2, otherDoc3];

        doc.saveAll().then(function() {
            Model.get(doc.id).getJoin().run().then(function(doc) {
                otherDoc1 = doc.otherDocs[0];
                otherDoc2 = doc.otherDocs[1];
                otherDoc3 = doc.otherDocs[2];
                otherDoc1.delete().then(function(result) {
                    assert.strictEqual(result, otherDoc1);
                    assert.equal(doc.isSaved(), true);
                    assert.equal(otherDoc1.isSaved(), false);
                    assert.equal(otherDoc2.isSaved(), true);
                    assert.equal(otherDoc3.isSaved(), true);
                    assert.equal(doc.otherDocs.length, 2);
                    Model.get(doc.id).getJoin().run().then(function(otherDoc1) {
                        assert.equal(doc.otherDocs.length, 2);
                        done();
                    });
                });
            });
        });
    });
});

describe('manual joins', function() {
    it('innerJoin', function(done) {
        var Model = thinky.createModel(util.s8(), {
            id: String
        });
        var OtherModel = thinky.createModel(util.s8(), {
            id: String
        });


        var doc = new Model({});
        var otherDocs = [new OtherModel({}), new OtherModel({}), new OtherModel({})];
        var promises = [doc.save(), otherDocs[0].save(), otherDocs[1].save(), otherDocs[2].save()];

        Promise.all(promises).then(function() {
            return Model.innerJoin(OtherModel.between(null, null)._query, function() { return true}).execute()
        }).then(function(cursor) {
            return cursor.toArray();
        }).then(function(result) {
            assert.equal(result.length, 3);
            assert.deepEqual(result[0].left, doc);
            assert.deepEqual(result[1].left, doc);
            assert.deepEqual(result[2].left, doc);
            done();
        });

    });
});
