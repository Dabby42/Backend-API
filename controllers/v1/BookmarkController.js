import autoBind from 'auto-bind';
import BaseController from './BaseController';
import Bookmark from './../../models/Bookmark';
import User from './../../models/User';
import Article from './../../models/Article';
import dotenv from 'dotenv';

dotenv.config();

class BookmarkController extends BaseController{
    constructor(){
        super();
        autoBind(this);
    }

  /**
   * @api {post} /v1/bookmark/ Create Bookmark
   * @apiName Create Bookmark
   * @apiGroup Bookmarks
   * @apiParam {String} articleId id of Article
   */
    async createBookmark(req, res) {
        const { userId, articleId } = req.body;

        try {
            
            let article = await Article.findOne({_id: articleId});

            if (!article) {
                return super.notfound(res, `No article found`);
            }

            let bookmark = await Bookmark.findOne({user: userId, article: articleId});
            if(bookmark){
                return super.success(res, Bookmark, 'Bookmark exist already');
            }
            bookmark = new Bookmark({article: articleId, user: userId});
            await bookmark.save()
            return super.success(res, Bookmark, 'Created Bookmark Successfully');
            
        } catch (error) {
            return super.actionFailure(res, `Couldn't create Bookmark`);
        }
        
    }

    /**
     * @api {get} /v1/bookmark Get Users' Bookmarks
     * @apiName Get Bookmark
     * @apiGroup Bookmark
     */
    async getBookmark(req, res) {
        const {userId} = req.body
        try {
            let bookmarks = await Bookmark.find({user: userId, isActive:true }).populate('article').exec();
                
            return super.success(res, bookmarks, 'Bookmark Retrieved');
             
        } catch (error) {

            return super.actionFailure(res, `Couldn't get bookmarks`);
        }
        
    }

    /**
     * @api {delete} /v1/bookmark/:id Remove Bookmark
     * @apiName Remove Bookmark
     * @apiGroup Bookmark
     */
    async removeBookmark(req, res) {
        const { userId } = req.body;
        try{
            let user = await User.findOne({_id:userId});
            if (user) {
                let bookmark = await Bookmark.findOne({user: userId});
                bookmark.isActive = false;
                bookmark.save();
                console.log(bookmark);
                
                return super.actionSuccess(res, 'Bookmark Deleted');
            }
            return super.notfound(res, `user not found`);
        }catch(err){
            console.log(err);
            return super.actionFailure(res, `Couldn't delete bookmark`);
        }
    }

    /**
   * @api {patch} /v1/bookmark/restore/:id Restore Bookmark
   * @apiName Restore Bookmark
   * @apiGroup Bookmark
   */
  async restoreBookmark(req, res){
    const { userId } = req.body;
    try{
        let user = await User.findOne({_id:userId});
        if (user) {
            let bookmark = await Bookmark.findOne({user: userId});
            bookmark.isActive = true;
            bookmark.save();
            return super.actionSuccess(res, 'Bookmark Restored');
        }
        return super.notfound(res, `user not found`);   
    }catch(err){
        console.log(err);
        return super.actionFailure(res, `Couldn't restore bookmark`);
    }
  }

}

module.exports = BookmarkController;
