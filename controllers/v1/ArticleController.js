import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import autoBind from 'auto-bind';
import BaseController from './BaseController';
import Article from './../../models/Article';
import dotenv from 'dotenv';
import axios from 'axios';
import secrets from './../../config/secrets';
import imageService from './../../services/ImageService';
dotenv.config();

class ArticleController extends BaseController{

  constructor(){
    super();
    autoBind(this);
  }
  /**
   * @api {post} /v1/article Create Article
   * @apiName Create Article
   * @apiGroup Article
   * @apiParam {String} title Article title
   * @apiParam {String} backgroundImage Article BackgroundImage
   * @apiParam {String} image Article Image
   * @apiParam {String} content Article Content Description
   * @apiParam {String} source Source of the Article
   * @apiParam {String} sourceImage ImageSource of the Article
   */
  async createArticle(req, res) {
    let {content, sourceImage, userId, publish, source, title, backgroundImage, image} = req.body;

    try{
        //have a default background image
        const service = new imageService('cloudinary');

        // checks if base64 image version exists and uploads to cloudinary
        if(backgroundImage)backgroundImage = await service.uploadBase64Image(backgroundImage);
        if(image)image = await service.uploadBase64Image(image);
        if(sourceImage)sourceImage = await service.uploadBase64Image(sourceImage);

        let data = {content, title, userId, published: publish};

        // checks if image uploaded and add it to the data
        if(backgroundImage) data.backgroundImage = backgroundImage.url;
        if(image) data.image = image.url;
        if(sourceImage) data.sourceImage = sourceImage.url;
        if(sourceImage) data.source = source;

        let article = new Article(data);
        await article.save();

        return super.success(res, article, 'Created Article Successfully');

    }catch(err){
        if(backgroundImage) await service.deleteImage(backgroundImage.id);
        if(image) await service.deleteImage(image.id);
        if(sourceImage) await service.deleteImage(sourceImage.id);
        return super.actionFailure(res, `Couldn't create article`);
    }
  }

  /**
   * @api {get} /v1/article Get Articles
   * @apiName Get Articles
   * @apiGroup Article
   */
  async getPublishedArticle(req, res){
    try{
        let article = await Article.find({published: true, isActive: true});
        return super.success(res, article, 'Article Retrieved');

    }catch(err){
        console.log(err);
        return super.actionFailure(res, `Couldn't retrieve article`);
    }
  }

    /**
   * @api {get} /v1/article/unpublished Get Unpublish Articles
   * @apiName Get Unpublished Articles
   * @apiGroup Article
   */
  async getUnpublishedArticle(req, res){
    try{
        let article = await Article.find({published: false, isActive: true});
        return super.success(res, article, 'Article Retrieved');

    }catch(err){
        console.log(err);
        return super.actionFailure(res, `Couldn't retrieve article`);
    }
  }

  /**
   * @api {patch} /v1/article/publish/:id Publish Article
   * @apiName Publish Article
   * @apiGroup Article
   */
  async publish(req, res){
    const { id } = req.body;
    try{
        let article = await Article.findOneAndUpdate({_id: id}, {published: true}, {new: true});
        return super.actionSuccess(res, 'Article Published');

    }catch(err){
        console.log(err);
        return super.actionFailure(res, `Couldn't publish article`);
    }
  }

  /**
   * @api {patch} /v1/article/unpublish/:id Publish Article
   * @apiName Publish Article
   * @apiGroup Article
   */
  async unpublish(req, res){
    const { id } = req.body;
    try{
        let article = await Article.findOneAndUpdate({_id: id}, {published: false}, {new: true});
        return super.actionSuccess(res, 'Article UnPublished');

    }catch(err){
        console.log(err);
        return super.actionFailure(res, `Couldn't unpublish article`);
    }
  }

  /**
   * @api {delete} /v1/article/:id Delete Article
   * @apiName Delete Article
   * @apiGroup Article
   */
  async deleteArticle(req, res){
    const { id } = req.body;
    try{
        let article = await Article.findOneAndUpdate({_id: id}, {isActive: false});
        return super.actionSuccess(res, 'Article Deleted');

    }catch(err){
        console.log(err);
        return super.actionFailure(res, `Couldn't delete article`);
    }
  }

  /**
   * @api {patch} /v1/article/restore/:id Restore Article
   * @apiName Restore Article
   * @apiGroup Article
   */
  async restoreArticle(req, res){
    const { id } = req.body;
    try{
        let article = await Article.findOneAndUpdate({_id: id}, {isActive: true});
        return super.actionSuccess(res, 'Article Restored');

    }catch(err){
        console.log(err);
        return super.actionFailure(res, `Couldn't restored article`);
    }
  }


}

module.exports = ArticleController;
