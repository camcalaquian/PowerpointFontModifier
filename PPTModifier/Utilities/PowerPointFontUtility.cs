using Spire.Presentation;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Reflection;

namespace PPTModifier.Utilities
{
    public static class PowerPointFontUtility
    {
        /// <summary>
        /// Updates all fonts including comments by searching for type TextCharacterProperties 
        /// </summary>
        /// <param name="obj">The object to be inspected</param>
        /// <param name="visited">The dictionary containing the objects that was already inspected</param>
        /// <returns></returns>
        public static void UpdateAllFontStyle(Presentation presentation, string fontName, float fontSize)
        {
            Action<TextCharacterProperties> action = textCharacterProperties =>
            {
                textCharacterProperties.LatinFont = new TextFont(fontName);
                textCharacterProperties.FontHeight = fontSize;
            };

            var objDict = new Dictionary<object, bool>(new ReferenceEqualityComparer());
            DeepSearch(presentation, objDict, action);
        }

        /// <summary>
        /// Checks if whether the input object should be skipped by checking for type or if it was already visited
        /// </summary>
        /// <param name="obj">The object to be inspected</param>
        /// <param name="visited">The dictionary containing the objects that was already inspected</param>
        /// <returns></returns>
        private static bool ShouldSkipObject(object obj, IDictionary<object, bool> visited)
        {
            bool shouldSkip = obj == null
                || obj is Type
                || obj is Pointer
                || visited.ContainsKey(obj);

            if (shouldSkip)
                return true;

            var objectType = obj.GetType();
            shouldSkip = objectType == typeof(string)
                || objectType.IsValueType
                || objectType.IsPrimitive
                || objectType == typeof(Spire.Presentation.Drawing.ColorFormat)
                || objectType == typeof(Spire.Presentation.RelativeRectangle)
                || objectType == typeof(Spire.Presentation.Collections.GradientStopCollection)
                || typeof(Delegate).IsAssignableFrom(objectType);

            return shouldSkip;
        }

        /// <summary>
        /// Recursively searches for an object of type T and calls for delegate action once it is found
        /// </summary>
        /// <param name="lookUpObject">The object to be inspected</param>
        /// <param name="visited">The dictionary containing the objects that was already inspected</param>
        /// <param name="action">The delegate that will be called when the type is found</param>
        /// <returns></returns>
        private static bool DeepSearch<T>(object lookUpObject, IDictionary<object, bool> visited, Action<T> action)
        {
            bool foundAnItem = false;
            if (ShouldSkipObject(lookUpObject, visited)) return false;
            visited.Add(lookUpObject, foundAnItem);

            //If object is array, list, collection, etc..
            if (lookUpObject is IEnumerable items)
            {
                foreach (var item in items)
                {
                    foundAnItem |= DeepSearch(item, visited, action);
                }
            }
            else
            {
                //Search all fields including private fields
                foreach (var field in lookUpObject.GetType().GetFields(BindingFlags.Instance | BindingFlags.NonPublic))
                {
                    var fieldValue = field.GetValue(lookUpObject);
                    if (fieldValue is T t)
                    {
                        foundAnItem = true;
                        //Call delegate
                        action(t);
                    }
                    else
                    {
                        foundAnItem |= DeepSearch(fieldValue, visited, action);
                    }
                }
            }

            if (foundAnItem)
                visited[lookUpObject] = true;

            return foundAnItem;
        }
    }


}
