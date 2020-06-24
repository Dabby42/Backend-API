import Helpers from '../../helpers/helper';
const isBase64 = require('is-base64');
/**
 * Defines methods for validating Article functions
 *
 * @class ArticleValidator
 */
class ArticleValidator extends Helpers{
  
  constructor(){
    super();
  }
    /**
   * validates Registration data
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   */
  validateArticle(req, res, next) {
    const {backgroundImage, source, image, sourceImage} = req.body;
   
    req.check('content', 'content field is required').notEmpty().trim();

    req.check('title', 'title field is required').notEmpty().trim();

    req.check('source', 'source field is required')
        .custom(() => {
            if(source){
                if(source.trim().length > 0){
                    return true;
                }
                return false;
            }
        })

    req.check('sourceImage', 'sourceImage must be a base64 string')
        .custom(() => {
            if(source){
                if (sourceImage){
                    if(sourceImage.trim().length > 0){
                        if(isBase64(sourceImage, {mime: true})){
                            
                            return true;
                          }else{
                              return false;
                          }
                    }
                }
            }
            
            return true;
        });

    req.check('backgroundImage', 'backgroundImage must be a base64 string')
        .custom(() => {
            if (backgroundImage){
                if(backgroundImage.trim().length > 0){
                    if(isBase64(backgroundImage, {mime: true})){
                        
                        return true;
                      }else{
                          return false;
                      }
                }
            }
            return true;
        });

    req.check('image', 'image must be a base64 string')
        .custom(() => {
            if (image){
                if(image.trim().length > 0){
                    if(isBase64(image, {mime: true})){
                        
                        return true;
                      }else{
                          return false;
                      }
                }
            }
            return true;
        });

    const errors = req.validationErrors();

    if (errors) {
        return super.validationFailed(res, super.extractErrors(errors));
    }
    return next();
  }


   /**
   * validates Registration data
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   */
  validateHasId(req, res, next) {
    req.body.id = req.params.id;
    req.check('id', 'id field is required').notEmpty().trim();

    const errors = req.validationErrors();

    if (errors) {
        return super.validationFailed(res, super.extractErrors(errors));
    }
    return next();
  }




}
  module.exports = ArticleValidator;